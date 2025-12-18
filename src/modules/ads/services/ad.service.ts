import axiosInstance from "@/shared/utils/axiosInstance";
import { 
    Ads, 
    AdsFormData, 
    AdsListResponse, 
    Category, 
    AdComment, 
    CommentsListResponse 
} from "@/types/ads.types";

// --- DTOs ---
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

export interface CommentResponseDTO { 
    id: number; 
    content: string; 
    user: { id: number; firstName: string; lastName: string; email: string }; 
    createdAt: string; 
}

// --- Mappers Auxiliares ---

const mapDtoToAd = (ad: AdResponseDTO): Ads => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    location: `${ad.city}, ${ad.district}`,
    category: ad.category?.name || 'Sin Categoría',
    imagenUrl: ad.image || '',
    usuario: {
        id: ad.user.id,
        firstName: ad.user.firstName,
        lastName: ad.user.lastName,
        email: ad.user.email,
        role: "USUARIO"
    },
    createdAt: ad.createdAt,
    updatedAt: ad.createdAt,
});

const mapDtoToComment = (c: CommentResponseDTO): AdComment => ({
    id: c.id,
    usuario: {
        id: c.user.id,
        firstName: c.user.firstName,
        lastName: c.user.lastName,
        email: c.user.email
    },
    contenido: c.content,
    fechaPublicacion: c.createdAt
});


// --- Servicios Principales ---

export const getCategories = async (): Promise<Category[]> => {
    const res = await axiosInstance.get<Category[]>("/categories");
    return res.data;
};

export const getMyAds = async () => {
    const res = await axiosInstance.get<AdResponseDTO[]>("/ads/mine");
    
    return {
        data: res.data.map(mapDtoToAd),
        total: res.data.length,
        page: 1,
        limit: res.data.length 
    };
};

/* SECCION DE ANUNCIOS */
 
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

export const getAdById = async (id: string | number): Promise<Ads | null> => {
    try {
        const res = await axiosInstance.get<AdResponseDTO>(`/ads/${id}`);
        return mapDtoToAd(res.data);
    } catch (error) {
        console.error("Error fetching ad:", error);
        return null;
    }
};

// --- SECCIÓN DE COMENTARIOS ---

export const getCommentsByAdId = async (adId: string | number, page = 1, limit = 5): Promise<CommentsListResponse> => {
    // GET /ads/{adId}/comments
    const res = await axiosInstance.get<SpringPageResponse<CommentResponseDTO>>(`/ads/${adId}/comments`, {
        params: { page: page - 1, size: limit }
    });

    return {
        data: res.data.content.map(mapDtoToComment),
        pagination: {
            totalComments: res.data.totalElements,
            currentPage: res.data.page + 1,
            totalPages: res.data.totalPages,
            commentsPerPage: res.data.size,
        }
    };
};

export const createComment = async (adId: number, content: string): Promise<AdComment> => {
    //POST /ads/{adId}/comments
    const res = await axiosInstance.post<CommentResponseDTO>(`/ads/${adId}/comments`, { content });
    return mapDtoToComment(res.data);
};

// --- Exportación Final ---

const AdService = {
    getCategories,
    getAds,
    getMyAds,
    createAd,
    getAdById,
    getCommentsByAdId,
    createComment
};

export default AdService;