import {create} from "zustand";
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
        const { token, user:userData } = authData;
        
        const userProfile: UserAuth = {
          id: userData.id,
          email: userData.email,
          nombre: userData.nombre,
          role: userData.role,
        };

        set({
          user: userProfile,
          token: token,
          isAuthenticated: true,
        })

      },
      logout: () => {
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