import axiosInstance  from "@/shared/utils/axiosInstance";
import { useAuthStore } from "@/stores/useAuthStore";
import { AuthResponse, LoginData, RegisterData } from "@/types/auth.types";

const AUTH_URL = "/auth";

export const AuthService = {
    
    login: async (credentials: LoginData): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthResponse>(`${AUTH_URL}/login`, credentials);
        useAuthStore.getState().setAuth(data);
        return data;
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthResponse>(`${AUTH_URL}/register`, userData);
        useAuthStore.getState().setAuth(data);
        return data;
    },

    logout: () => {
        useAuthStore.getState().logout();
    },
};

export default AuthService;