import { User } from "./auth.types";

export interface Category {
    idCategoria: number;
    nombreCategoria: string; 
}

export interface CommentCreateData {
    contenido: string;
    idPublicacion: number;
}

export interface AdUsuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
  fotoPerfil?: string | null;
}


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

export interface AdsFormData {
    title: string;
    idCategoria: number;
    description: string;
    location: string;
    category: string;
    imagenUrl: string | null;
    estado: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVO';
}

export interface AdsListResponse{
    data: Ads[];
    pagination: {
        totalAds: number;
        currentPage: number;
        totalPages: number;
        adsPerPage: number;
    }
}