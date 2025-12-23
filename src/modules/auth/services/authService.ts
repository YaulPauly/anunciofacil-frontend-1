import axiosInstance from "@/shared/utils/axiosInstance";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AuthAPIResponse,
  AuthResponse,
  LoginData,
  RegisterData,
} from "@/types/auth.types";

const AUTH_URL = "/auth";

export const AuthService = {
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthAPIResponse>(
      `${AUTH_URL}/login`,
      credentials
    );
    const adaptedResponse: AuthResponse = {
      token: data.token,
      user: {
        id: 0,
        email: data.email,
        firstName: `${data.firstName}`,
        lastName: `${data.lastName}`,
        role: data.role,
      },
    };
    useAuthStore.getState().setAuth(adaptedResponse);
    return adaptedResponse;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const payload = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
    const { data } = await axiosInstance.post<AuthAPIResponse>(
      `${AUTH_URL}/register`,
      payload
    );
    const adaptedResponse: AuthResponse = {
      token: data.token,
      user: {
        id: 0,
        email: data.email,
        firstName: `${data.firstName}`,
        lastName: `${data.lastName}`,
        role: data.role,
      },
    };

    useAuthStore.getState().setAuth(adaptedResponse);
    return adaptedResponse;
  },
  logout: () => {
    useAuthStore.getState().logout();
  },
};

export default AuthService;
