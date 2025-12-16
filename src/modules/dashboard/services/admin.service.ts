import axiosInstance from "@/shared/utils/axiosInstance";

export interface AdminDashboardStats {
    totalUsers: number;
    totalAds: number;
    totalActiveAds: number;
    totalPendingAds: number;
    totalRejectedAds: number;
    totalComments: number;
    newUsersThisMonth: number;
    newAdsThisMonth: number;
}

export interface User {
    id: number;
    nombre: string;
    email: string;
    fechaRegistro: string;
    estado: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface UsersListResponse {
    data: User[];
    pagination: {
        totalUsers: number;
        currentPage: number;
        totalPages: number;
        usersPerPage: number;
    }
}

export interface AdminAdResume {
    id: string;
    title: string;
    location: string;
    category: string;
    imagenUrl: string;
    datePost: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";
    user: {
        id: number;
        nombre: string;
        email: string;
    }
}

export interface AdminAdsListResponse {
    data: AdminAdResume[];
    pagination: {
        totalAds: number;
        currentPage: number;
        totalPages: number;
        adsPerPage: number;
    }
}

export interface AdminAdComment {
    id: number;
    usuario: {
        id:number;
        nombre: string;
        email:string;
    }
    contenido: string;
    fechaPublicacion: string;
}

export interface AdminCommentsListResponse {
    data: AdminAdComment[];
    pagination: {
        totalComments: number;
        currentPage: number;
        totalPages: number;
        commentsPerPage: number;
    }
}

export const getUsers = async () : Promise<UsersListResponse> => {
    const res = await axiosInstance.get<UsersListResponse>("/admin/users");
    return res.data;
}