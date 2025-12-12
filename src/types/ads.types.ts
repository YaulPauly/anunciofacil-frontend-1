import { User } from "./auth.types";

export interface Ads {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    imagenUrl: string;
    usuario: User;
    createdAt: string;
    updatedAt: string;
}

export interface AdsFormData {
    title: string;
    description: string;
    location: string;
    category: string;
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