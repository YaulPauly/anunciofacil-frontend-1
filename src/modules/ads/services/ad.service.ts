import axiosInstance from "@/shared/utils/axiosInstance";

import { Ads, AdsFormData, AdsListResponse, Category, CommentCreateData } from "@/types/ads.types";
import { User } from "@/types/auth.types";

export interface SpringPageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
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
};

export interface AdComment {
    id: number;
    usuario: {
        id:number;
        nombre: string;
        email:string;
    }
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
    }
}


interface PublicacionResponse {
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
    user?: { id?: number | string; email?: string; firstName?: string; lastName?: string };
    createdAt?: string;
    // compat antiguos
    titulo?: string;
    contenido?: string;
    fechaPublicacion?: string;
    locacion?: string;
    imagenes?: string | null;
    estado?: string;
    categoria?: { nombreCategoria?: string };
    usuario?: User; 
}


export const getCategories = async (): Promise<Category[]> => {
    const res = await axiosInstance.get<Category[]>("/categorias/all");
    return res.data;
};

export const getCommentsByAdId = async (adId:string, page = 1, limit = 5): Promise<CommentsListResponse> => {
    const res = await axiosInstance.get<SpringPageResponse<AdComment>>(`/comments/ads/${adId}`, {
        params: { page: page - 1, size: limit }
    });

    const springData = res.data;

    return {
        data: springData.content,
        pagination: {
            totalComments: springData.totalElements,
            currentPage: springData.number + 1, 
            totalPages: springData.totalPages,
            commentsPerPage: springData.size,
        }
    }
}


export const createComment = async (adId: number, content: string): Promise<AdComment> => {
    const payload: CommentCreateData = {
        contenido: content,
        idPublicacion: adId,
    };
    const res = await axiosInstance.post<AdComment>("/comments", payload);
    return res.data;
}

export const createAd = async (data: AdsFormData): Promise<Ads> => {
    const res = await axiosInstance.post<Ads>("/ads/create", data);
    return res.data;
}

export const getMyAds = async (page = 1, limit = 9) : Promise<MyAdsListResponse> => {

    const springPage = page - 1; 

    const res = await axiosInstance.get<SpringPageResponse<PublicacionResponse>>("/ads/my-ads", {
        params: { page: springPage, size: limit }
    });
    
    const springData = res.data;

    const mappedAds: AdResume[] = springData.content.map(ad => ({
        id: ad.idPublicacion.toString(),
        title: ad.titulo ?? 'Sin título',
        location: ad.locacion ?? 'Sin locación',
        category: ad.categoria?.nombreCategoria ?? 'Sin categoria',
        imagenUrl: ad.imagenes || '',
        datePost: ad.fechaPublicacion,
        status: ad.estado as AdResume['status'],
    }));
    return {
        data: mappedAds,
        total: springData.totalElements,
        page: springData.number + 1, 
        limit: springData.size
    }
}

type AdsFilters = {
    categoryId?: number | string;
    city?: string;
    status?: string;
};

export const getAds = async (
    page = 1, 
    limit = 10,
    filters: AdsFilters = {}
): Promise<AdsListResponse> => {


    const res = await axiosInstance.get<SpringPageResponse<PublicacionResponse>>("/ads", {
        params: { 
            page: page - 1, 
            size: limit,
            categoryId: filters.categoryId,
            city: filters.city,
            status: filters.status ?? "ACTIVO",
        },
    });

    const springData = res.data;
    
    const mappedAds: Ads[] = springData.content.map(ad => {
        const generatedId = `${ad.id ?? ad.idPublicacion ?? ad.title ?? Date.now()}-${Math.random()}`;
        const userFromNew = ad.user
            ? {
                idUsuario: ad.user.id ?? ad.user.email ?? generatedId,
                nombre: [ad.user.firstName, ad.user.lastName].filter(Boolean).join(" ").trim() || ad.user.email || "Usuario",
                email: ad.user.email ?? "",
                rol: undefined,
              }
            : undefined;

        return {
            id: ad.id ?? ad.idPublicacion ?? generatedId,
            title: ad.title ?? ad.titulo ?? 'Sin título',
            description: ad.description ?? ad.contenido ?? ad.detail ?? 'Sin descripción',
            location: ad.city ?? ad.locacion ?? ad.district ?? 'Sin ubicación',
            category: ad.category?.name ?? ad.categoria?.nombreCategoria ?? 'Sin categoría',
            imagenUrl: ad.image ?? ad.imagenes ?? null,
            usuario: userFromNew ?? ad.usuario ?? null, 
            createdAt: ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
            updatedAt: ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(), 
        };
    });


    return {
        data: mappedAds,
        pagination: {
            totalAds: springData.totalElements,
            currentPage: springData.number + 1,
            totalPages: springData.totalPages,
            adsPerPage: springData.size,
        }
    }
}

export const getAdById = async (id: string | number): Promise<Ads | null> => {
    try {
        const res = await axiosInstance.get<PublicacionResponse>(`/ads/${id}`);
        const ad = res.data;

        return {
            id: ad.id ?? ad.idPublicacion ?? id,
            title: ad.title ?? ad.titulo ?? 'Sin título',
            description: ad.description ?? ad.contenido ?? ad.detail ?? 'Sin descripción',
            location: ad.city ?? ad.locacion ?? ad.district ?? 'Sin ubicación',
            category: ad.category?.name ?? ad.categoria?.nombreCategoria ?? 'Sin categoría',
            imagenUrl: ad.image ?? ad.imagenes ?? null,
            usuario: ad.user 
                ? {
                    idUsuario: ad.user.id ?? ad.user.email ?? id,
                    nombre: [ad.user.firstName, ad.user.lastName].filter(Boolean).join(" ").trim() || ad.user.email || "Usuario",
                    email: ad.user.email ?? "",
                    rol: undefined,
                  }
                : ad.usuario ?? null,
            createdAt: ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
            updatedAt: ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
        } as Ads;

    } catch (error) {

        console.error(`Error fetching ad ID ${id}:`, error);
        return null;
    }
};

const AdService = {
    getCategories,
    getCommentsByAdId,
    createAd,
    getMyAds,
    getAds,
    getAdById,
    createComment
}

export default AdService;
