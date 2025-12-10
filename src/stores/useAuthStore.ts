import {create} from "zustand";

export type User = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    avatarUrl?: string;
    
};

type AuthState = {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    isLogged: () => boolean;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== "undefined") localStorage.setItem("access_token", token);
    set({ user, token });
  },
  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("access_token");
    set({ user: null, token: null });
  },
  isLogged: () => !!(typeof window !== "undefined" && localStorage.getItem("access_token")),
}));