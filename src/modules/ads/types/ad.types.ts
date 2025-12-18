import { User } from "@/types/auth.types";

export interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  page?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export type MyAdsListResponse = {
  data: AdResume[];
  total: number;
  page: number;
  limit: number;
};

export type AdResume = {
  id: string;
  title: string;
  location: string;
  category: string;
  imagenUrl: string;
  datePost: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVO";
  owner?: string;
};
export interface PublicacionResponse {
  id?: number | string;
  idPublicacion?: number;
  title?: string;
  description?: string;
  detail?: string;
  image?: string | null;
  city?: string;
  district?: string;
  status?: string;
  category?: { id?: number; name?: string; description?: string };
  user?: Omit<User, "role">;
  createdAt?: string;
  titulo?: string;
  contenido?: string;
  fechaPublicacion?: string;
  locacion?: string;
  imagenes?: string | null;
  estado?: string;
  categoria?: { nombreCategoria?: string };
  usuario?: User;
}

export type AdsFilters = {
  categoryId?: number | string;
  city?: string;
  district?: string;
  status?: string;
};
