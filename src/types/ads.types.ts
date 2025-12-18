import { User } from "./auth.types";

// --- Categorías ---
export interface Category {
  id?: number;
  name?: string;
  description?: string;
  // Compatibilidad con backend anterior
  idCategoria?: number;
  nombreCategoria?: string;
}

export interface CommentCreateData {
  contenido: string;
  idPublicacion: number;
}

// --- Usuarios en Anuncios ---
export interface AdUsuario {
  idUsuario: number | string;
  nombre: string;
  email: string;
  rol?: string;
}

export interface Ads {
  id: number | string;
  title: string;
  description: string;
  category: string;
  location: string;
  imagenUrl: string | null;
  usuario: AdUsuario | User | null;
  createdAt: string;
  updatedAt: string;
  status?: string;
  district?: string;
  city?: string;
  detail?: string;
}

export interface AdsFormData {
  title: string;
  description: string;
  city: string;
  district: string;
  categoryId: number;
  detail?: string;
  image: string | null;
}

export interface AdsListResponse {
  data: Ads[];
  pagination: {
    totalAds: number;
    currentPage: number;
    totalPages: number;
    adsPerPage: number;
  };
}

export interface AdComment {
  id: number | string;
  usuario: {
    id: number | string;
    nombre: string;
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
