import axiosInstance from "@/shared/utils/axiosInstance";

import { Ads, AdsFormData, AdsListResponse } from "@/types/ads.types";
import { User } from "@/types/auth.types";

const MOCK_USER: User = {
    id: 1,
    email: "test@anunciofacil.com",
    nombre: "Usuario Mock",
    role: "user",
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


export type AdResume = {
    id: string;
    title: string;
    location: string;
    category: string;
    imagenUrl: string;
    datePost: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
};

export const createAd = async (data: AdsFormData): Promise<Ads> => {
    console.log("MOCK: Creando anuncio con data:", data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newAd: Ads = {
                id: MOCK_ANUNCIOS.length + 1,
                ...data,
                imagenUrl: 'https://picsum.photos/id/50/600/400',
                usuario: MOCK_USER,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            MOCK_ANUNCIOS.unshift(newAd); // Añadirlo al inicio
            resolve(newAd);
        }, 500);
    });
}

export const getMyAds = async (page = 1, limit = 10) : Promise<{data: AdResume[]; total: number; page:number; limit:number}> => {
    const res = await axiosInstance.get("/ads/my-ads", {
        params: { page, limit }
    });
    return res.data;
}

export const getAds = async (page = 1, limit = 10): Promise<AdsListResponse> => {
    const res = await axiosInstance.get("/ads", {
        params: { page, limit }
    });
    return res.data;
}
/*
export const createAd = async (adData: AdsFormData): Promise<Ads> => {
    const res = await axiosInstance.post("/ads/create", adData);
    return res.data;
}
*/

export const getAdById = async (id: string | number): Promise<Ads | null> => {
    const numericId = Number(id);
    return new Promise((resolve) => {
        setTimeout(() => {
            const anuncio = MOCK_ANUNCIOS.find(a => a.id === numericId) || null;
            resolve(anuncio);
        }, 500);
    });
}