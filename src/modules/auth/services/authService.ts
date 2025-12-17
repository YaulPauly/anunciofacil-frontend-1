// src/modules/auth/services/authService.ts
import axiosInstance  from "@/shared/utils/axiosInstance";
import { useAuthStore } from "@/stores/useAuthStore";
import { AuthAPIResponse, AuthResponse, LoginData, RegisterData } from "@/types/auth.types";

const AUTH_URL = "/auth";

export const AuthService = {
    
    login: async (credentials: LoginData): Promise<AuthResponse> => {
        const { data } = await axiosInstance.post<AuthAPIResponse>(`${AUTH_URL}/login`, credentials);
        const adaptedResponse: AuthResponse = {
            token: data.token,
            user: {
                id: 0, 
                email: data.email,
                nombre: `${data.firstName} ${data.lastName}`,
                role: data.role
            }
        };
        useAuthStore.getState().setAuth(adaptedResponse);
        return adaptedResponse;
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        // 1. Mapeamos tus campos (nombre/apellidos) a lo que espera Java (firstName/lastName)
        const payload = {
            email: userData.email,
            password: userData.password,
            firstName: userData.nombre,
            lastName: userData.apellidos
        };
        const { data } = await axiosInstance.post<AuthAPIResponse>(`${AUTH_URL}/register`, payload);
        const adaptedResponse: AuthResponse = {
            token: data.token,
            user: {
                id: 0, 
                email: data.email,
                nombre: `${data.firstName} ${data.lastName}`,
                role: data.role
            }
        };

        useAuthStore.getState().setAuth(adaptedResponse);
        return adaptedResponse;
    },
    logout: () => {
        useAuthStore.getState().logout();
    },
};

export default AuthService;