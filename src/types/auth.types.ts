export interface User {
    id: number;
    email: string;
    nombre: string;
    role: "user" | "admin";
}

export interface AuthState {
    user: User | null;
    token: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;

}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    nombre: string;
}