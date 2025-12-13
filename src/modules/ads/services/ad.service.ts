import axiosInstance from "@/shared/utils/axiosInstance";

import { Ads, AdsFormData, AdsListResponse, Category } from "@/types/ads.types";
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
    userId: number;
    userName: string;
    content: string;
    createdAt: string;
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
    idPublicacion: number;
    titulo: string;
    contenido: string;
    fechaPublicacion: string;
    locacion: string;
    imagenes: string | null;
    estado: string;
    categoria: { nombreCategoria: string };
    usuario: User; 
}


export const getCategories = async (): Promise<Category[]> => {
    const res = await axiosInstance.get<Category[]>("/categorias/all");
    return res.data;
};

export const getCommentsByAdId = async (adId: string, page = 1, limit = 5): Promise<CommentsListResponse> => {
    const res = await axiosInstance.get<SpringPageResponse<AdComment>>(`/ads/${adId}/comments`, {
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
};


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
        title: ad.titulo,
        location: ad.locacion,
        category: ad.categoria.nombreCategoria,
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

export const getAds = async (page = 1, limit = 10): Promise<AdsListResponse> => {

    const res = await axiosInstance.get<SpringPageResponse<PublicacionResponse>>("/ads/all", {
        params: { page: page - 1, size: limit } 
    });

    const springData = res.data;
    
    const mappedAds: Ads[] = springData.content.map(ad => ({
        id: ad.idPublicacion,
        title: ad.titulo,
        description: ad.contenido,
        location: ad.locacion,
        category: ad.categoria.nombreCategoria,
        imagenUrl: ad.imagenes || '',
        usuario: ad.usuario, 
        createdAt: ad.fechaPublicacion,
        updatedAt: ad.fechaPublicacion, 
    }));


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
            id: ad.idPublicacion,
            title: ad.titulo,
            description: ad.contenido,
            location: ad.locacion,
            category: ad.categoria.nombreCategoria,
            imagenUrl: ad.imagenes || '',
            usuario: ad.usuario,
            createdAt: ad.fechaPublicacion,
            updatedAt: ad.fechaPublicacion,
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
    getAdById
};

export default AdService;