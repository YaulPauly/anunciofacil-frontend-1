import axiosInstance from "@/shared/utils/axiosInstance";

import { Ads, AdsFormData, AdsListResponse, Category } from "@/types/ads.types";
import { User } from "@/types/auth.types";

const MOCK_USER: User = {
    id: 1,
    email: "test@anunciofacil.com",
    nombre: "Usuario Mock",
    role: "USUARIO",
};

const MOCK_ANUNCIOS: Ads[] = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    title: `Anuncio de Prueba ${i + 1}: Vendo Xiaomi 13 Pro`,
    description: `Smartphone de alta gama con triple cámara Leica y procesador Snapdragon. Publicado el ${new Date().toLocaleDateString()}.`,
    category: ['autos', 'inmuebles', 'bienes', 'servicios'][i % 4],
    location: ['Lima', 'Arequipa', 'Cusco', 'Trujillo'][i % 4],
    imagenUrl: `https://picsum.photos/id/${10 + i}/600/400`,
    usuario: MOCK_USER,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

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
    status: "PENDING" | "APPROVED" | "REJECTED";
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

const MOCK_COMMENTS: AdComment[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    userId: (i % 3) + 2, // Diferentes usuarios mock
    userName: `Comentarista ${i + 1}`,
    content: `Este es el comentario número ${i + 1}. Me interesa mucho el producto, ¿podrías darme un poco más de información? ¡Gracias!`,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(), // Comentarios recientes
}));


export const getCategories = async (): Promise<Category[]> => {

    const res = await axiosInstance.get<Category[]>("/categorias/all");
    return res.data;
};

export const getCommentsByAdId = async (adId: string, page = 1, limit = 5): Promise<CommentsListResponse> => {
    console.log("MOCK: Obteniendo comentarios para anuncio ID:", adId, "Página:", page, "Límite:", limit);
    return new Promise((resolve)=> {
        setTimeout(() => {
            const totalComments = MOCK_COMMENTS.length;
            const commentsPerPage = Math.max(1, limit);
            const totalPages = Math.ceil(totalComments / commentsPerPage);
            const currentPage = Math.min(Math.max(1, page), totalPages);

            const startIndex = (currentPage - 1) * commentsPerPage;
            const endIndex = startIndex + commentsPerPage;
            const paginatedComments = MOCK_COMMENTS.slice(startIndex, endIndex);
            resolve({
                data: paginatedComments,
                pagination: {
                    totalComments,
                    currentPage,
                    totalPages,
                    commentsPerPage,
                }
            });
        }, 600);
    })
}


export const createAd = async (data: AdsFormData): Promise<Ads> => {
    // Implementación real a la API
    const res = await axiosInstance.post<Ads>("/ads/create", data);
    return res.data;
}

export const getMyAds = async (page = 1, limit = 9) : Promise<MyAdsListResponse> => {

    const springPage = page - 1; 

    const res = await axiosInstance.get<SpringPageResponse<AdResume>>("/ads/my-ads", {
        params: { page: springPage, size: limit }
    });
    
    const springData = res.data;

    return {
        data: springData.content,
        total: springData.totalElements,
        page: springData.number + 1, 
        limit: springData.size
    }
}

export const getAds = async (page = 1, limit = 10): Promise<AdsListResponse> => {
    const res = await axiosInstance.get("/ads/all", {
        params: { page, limit }
    });
    return res.data;
}


export const getAdById = async (id: string | number): Promise<Ads | null> => {
    const numericId = Number(id);
    return new Promise((resolve) => {
        setTimeout(() => {
            const anuncio = MOCK_ANUNCIOS.find(a => a.id === numericId) || null;
            resolve(anuncio);
        }, 500);
    });
}

const AdService = {
    getCategories,
    getCommentsByAdId,
    createAd,
    getMyAds,
    getAds,
    getAdById
};

export default AdService;