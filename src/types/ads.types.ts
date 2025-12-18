import { User } from "./auth.types";

// --- Categorías ---
export interface Category {
    id: number;
    name: string;
    description?: string; 
}

// --- Comentarios---
export interface AdComment {
    id: number;
    usuario: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    contenido: string;
    fechaPublicacion: string; 
}

export interface CommentsListResponse {
    data: AdComment[];
    pagination: {
        totalComments: number;
        currentPage: number;
        totalPages: number;
        commentsPerPage: number;
    };
}

export interface CommentCreateData {
    contenido: string;
    idPublicacion: number;
}

// --- Usuarios en Anuncios ---
export interface AdUsuario {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string; 
    fotoPerfil?: string | null;
}

// --- Anuncios ---
export interface Ads {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    imagenUrl: string;
    usuario: AdUsuario | User | null; 
    createdAt: string;
    updatedAt: string;
}

export interface AdsListResponse {
    data: Ads[];
    pagination: {
        totalAds: number;
        currentPage: number;
        totalPages: number;
        adsPerPage: number;
    }
}

// --- Formularios ---
export interface AdsFormData {
    title: string;
    description: string;
    location: string;
    category: string; 
    price?: number;
    image?: File | null;
}