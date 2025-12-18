export interface AuthAPIResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status?: UserStatusType;
}
export interface User {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
}

export type UserStatusType = "ACTIVE" | "BLOCKED";

//Estado de la sesión
export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface AuthResponse {
  token: string;
  user?: User;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}
