// Interfaz exacta de lo que devuelve Spring Boot
export interface AuthAPIResponse {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

//Interfaz del usuario
export interface User {
    id?: number; // Opcional, ya que el endpoint de login NO devuelve el ID
    email: string;
    nombre: string;
    role: "USUARIO" | "ADMIN" | string;
}

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