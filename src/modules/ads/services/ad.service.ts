import axiosInstance from "@/shared/utils/axiosInstance";

export type AdResume = {
    id: string;
    titulo: string;
    locacion: string;
    categoria: string;
    imagenUrl: string;
    fechaPublicacion: string;
    estado: "PENDING" | "APPROVED" | "REJECTED";
};

export const getMyAds = async (page = 1, limit = 10) : Promise<{data: AdResume[]; total: number; page:number; limit:number}> => {
    const res = await axiosInstance.get("/ads/my-ads", {
        params: { page, limit }
    });
    return res.data;
}