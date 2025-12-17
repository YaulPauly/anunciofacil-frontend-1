import axiosInstance from "@/shared/utils/axiosInstance";
import { Ads, AdsFormData, AdsListResponse, Category } from "@/types/ads.types";

// Tipos exactos del Backend
export interface SpringPageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface AdResponseDTO {
    id: number;
    title: string;
    description: string;
    image: string | null;
    city: string;
    district: string;
    status: string;
    category: { id: number; name: string };
    user: { id: number; firstName: string; lastName: string; email: string };
    createdAt: string;
}

// Mapper auxiliar
const mapDtoToAd = (ad: AdResponseDTO): Ads => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    location: `${ad.city}, ${ad.district}`,
    category: ad.category?.name || 'Sin Categoría',
    imagenUrl: ad.image || '',
    usuario: {
        id: ad.user.id,
        nombre: `${ad.user.firstName} ${ad.user.lastName}`,
        email: ad.user.email
    } as any,
    createdAt: ad.createdAt,
    updatedAt: ad.createdAt,
});

export const getAds = async (page = 1, limit = 10): Promise<AdsListResponse> => {
    const res = await axiosInstance.get<SpringPageResponse<AdResponseDTO>>("/ads", {
        params: { page: page - 1, size: limit }
    });

    return {
        data: res.data.content.map(mapDtoToAd),
        pagination: {
            totalAds: res.data.totalElements,
            currentPage: res.data.page + 1,
            totalPages: res.data.totalPages,
            adsPerPage: res.data.size,
        }
    };
};

// 2. OBTENER MIS ANUNCIOS (LISTA PLANA)
// Endpoint: GET /ads/mine
export const getMyAds = async () => {
    // NOTA: Este endpoint devuelve un Array directo [], no un objeto PagedResponse
    const res = await axiosInstance.get<AdResponseDTO[]>("/ads/mine");
    
    return {
        data: res.data.map(mapDtoToAd),
        total: res.data.length,
        page: 1,
        limit: res.data.length // Al ser lista completa, el límite es el total
    };
};

// 3. OBTENER CATEGORÍAS
export const getCategories = async (): Promise<Category[]> => {
    const res = await axiosInstance.get<Category[]>("/categories");
    return res.data;
};

// 4. CREAR ANUNCIO
export const createAd = async (data: AdsFormData, file?: File): Promise<Ads> => {
    const formData = new FormData();
    const adRequest = {
        title: data.title,
        description: data.description,
        city: "Lima", 
        district: data.location,
        categoryId: Number(data.category),
        detail: data.description
    };

    formData.append("ad", new Blob([JSON.stringify(adRequest)], { type: "application/json" }));
    if (file) formData.append("file", file);

    const res = await axiosInstance.post<AdResponseDTO>("/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return mapDtoToAd(res.data);
};

// 5. OBTENER DETALLE
export const getAdById = async (id: string | number): Promise<Ads | null> => {
    try {
        const res = await axiosInstance.get<AdResponseDTO>(`/ads/${id}`);
        return mapDtoToAd(res.data);
    } catch (error) {
        console.error("Error fetching ad:", error);
        return null;
    }
};

const AdService = {
    getCategories,
    getAds,
    getMyAds,
    createAd,
    getAdById
};

export default AdService;