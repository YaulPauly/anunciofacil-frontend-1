import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthResponse, User } from "@/types/auth.types";
import { ROLES } from "@/shared/constants/roles";

export type UserAuth = Omit<User, "token">;



type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    setAuth: (authData: AuthResponse) => void;
    logout: () => void;
    setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (authData) => {
        const { token, user: userData } = authData;
        
        const payload = token ? (() => {
          try {
            return JSON.parse(atob(token.split(".")[1] || ""));
          } catch {
            return null;
          }
        })() : null;

        const roleFromPayload = Array.isArray(payload?.authorities) ? payload.authorities[0] : payload?.role;
        const normalizedRole =
          userData?.role === ROLES.ADMIN || authData.role === ROLES.ADMIN || roleFromPayload === ROLES.ADMIN
            ? ROLES.ADMIN
            : ROLES.USER;

        const firstName = userData?.firstName ?? authData.firstName ?? payload?.name ?? "";
        const lastName = userData?.lastName ?? authData.lastName ?? payload?.surname ?? "";

        const email = userData?.email ?? authData.email ?? payload?.sub ?? "";

        const userProfile: UserAuth = {
          id: userData?.id ?? payload?.userId ?? payload?.id ?? email,
          email,
          firstName,
          lastName,
          role: normalizedRole,
        };

        if(!token || !email){
          console.error("Datos de autenticación incompletos falta email o token");
          return;
        }

        set({
          user: userProfile,
          token: token,
          isAuthenticated: true,
        })

      },
      logout: () => {
        try {
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem("anuncia-facil-auth");
          }
        } catch {
          // ignore
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "anuncia-facil-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: !!state.user && !!state.token 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      }
    }
  )
);
