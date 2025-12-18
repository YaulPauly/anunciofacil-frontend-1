export interface AuthAPIResponse {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status?: UserStatusType
}

//Interfaz del usuario
export interface User {
    id?: number; 
    email: string;
    firstName: string;
    lastName: string;
    role: "USUARIO" | "ADMIN" | string;
}

export type UserStatusType = 'ACTIVE' | 'BLOCKED';

//Estado de la sesión
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

//Datos para registro
export interface RegisterData {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
}