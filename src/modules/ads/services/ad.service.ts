import axiosInstance from "@/shared/utils/axiosInstance";

import {
  AdResume,
  AdsFilters,
  MyAdsListResponse,
  PublicacionResponse,
  SpringPageResponse,
} from "../types/ad.types";
import {
  AdComment,
  Ads,
  AdsFormData,
  AdsListResponse,
  Category,
  CommentCreateData,
  CommentsListResponse,
} from "@/types/ads.types";

export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<any[]>("/categories");
  return res.data.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    idCategoria: cat.id,
    nombreCategoria: cat.name,
  }));
};

export const createCategory = async (
  name: string,
  description: string
): Promise<Category> => {
  const res = await axiosInstance.post<any>("/categories", {
    name,
    description,
  });
  const cat = res.data;
  return {
    id: cat.id,
    name: cat.name,
    description: cat.description,
    idCategoria: cat.id,
    nombreCategoria: cat.name,
  };
};

export const updateCategory = async (
  id: string | number,
  name: string,
  description: string
): Promise<Category> => {
  const res = await axiosInstance.put<any>(`/categories/${id}`, {
    name,
    description,
  });
  const cat = res.data;
  return {
    id: cat.id,
    name: cat.name,
    description: cat.description,
    idCategoria: cat.id,
    nombreCategoria: cat.name,
  };
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};

export const getCommentsByAdId = async (
  adId: string,
  page = 1,
  limit = 5
): Promise<CommentsListResponse> => {
  const res = await axiosInstance.get<SpringPageResponse<any>>(
    `/ads/${adId}/comments`,
    {
      params: { page: page - 1, size: limit },
    }
  );

  const springData = res.data;
  const mappedComments: AdComment[] = springData.content.map(
    (comment: any) => ({
      id: comment.id,
      contenido: comment.content ?? comment.contenido ?? "",
      usuario: {
        id: comment.user?.id ?? "",
        nombre:
          [comment.user?.firstName, comment.user?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
          comment.user?.email ||
          "Usuario",
        email: comment.user?.email ?? "",
      },
      fechaPublicacion:
        comment.createdAt ??
        comment.fechaPublicacion ??
        new Date().toISOString(),
    })
  );

  return {
    data: mappedComments,
    pagination: {
      totalComments: springData.totalElements,
      currentPage: (springData.page ?? springData.number) + 1,
      totalPages: springData.totalPages,
      commentsPerPage: springData.size,
    },
  };
};

export const createComment = async (
  adId: number,
  content: string
): Promise<AdComment> => {
  const res = await axiosInstance.post<any>(`/ads/${adId}/comments`, { content });
  const comment = res.data;
  return {
    id: comment.id,
    contenido: comment.content ?? content,
    usuario: {
      id: comment.user?.id ?? "",
      nombre:
        [comment.user?.firstName, comment.user?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || comment.user?.email || "Usuario",
      email: comment.user?.email ?? "",
    },
    fechaPublicacion: comment.createdAt ?? new Date().toISOString(),
  };
};

export const updateComment = async (
  adId: number | string,
  commentId: number | string,
  content: string
): Promise<AdComment> => {
  const res = await axiosInstance.put<any>(`/ads/${adId}/comments/${commentId}`, { content });
  const comment = res.data;
  return {
    id: comment.id ?? commentId,
    contenido: comment.content ?? content,
    usuario: {
      id: comment.user?.id ?? "",
      nombre:
        [comment.user?.firstName, comment.user?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || comment.user?.email || "Usuario",
      email: comment.user?.email ?? "",
    },
    fechaPublicacion: comment.createdAt ?? new Date().toISOString(),
  };
};

export const deleteComment = async (adId: number | string, commentId: number | string): Promise<void> => {
  await axiosInstance.delete(`/ads/${adId}/comments/${commentId}`);
};

export const createAd = async (
  data: AdsFormData,
  file?: File
): Promise<Ads> => {
  const formData = new FormData();
  formData.append(
    "ad",
    new Blob(
      [
        JSON.stringify({
          title: data.title,
          description: data.description,
          city: data.city,
          district: data.district,
          categoryId: data.categoryId,
          detail: data.detail ?? "",
          image: null,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (file) {
    formData.append("file", file);
  }
  const res = await axiosInstance.post<PublicacionResponse>("/ads", formData);
  const ad = res.data;
  return {
    id: ad.id ?? ad.idPublicacion ?? "",
    title: ad.title ?? ad.titulo ?? data.title,
    description: ad.description ?? ad.contenido ?? data.description,
    location: ad.city ?? ad.locacion ?? ad.district ?? data.city,
    category: ad.category?.name ?? ad.categoria?.nombreCategoria ?? "",
    imagenUrl: ad.image ?? ad.imagenes ?? null,
    usuario: ad.user ?? ad.usuario ?? null,
    createdAt: ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
    updatedAt: ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
    status: ad.status ?? ad.estado ?? "ACTIVO",
  };
};

export const getMyAds = async (
  page = 1,
  limit = 10
): Promise<MyAdsListResponse> => {
  const springPage = page - 1;

  const res = await axiosInstance.get<
    SpringPageResponse<PublicacionResponse> | PublicacionResponse[]
  >("/ads/mine", {
    params: { page: springPage, size: limit },
  });

  const payload = res.data as any;
  const content: PublicacionResponse[] = Array.isArray(payload)
    ? payload
    : payload?.content ?? [];

  const mappedAds: AdResume[] = content.map((ad) => ({
    id: (ad.id ?? ad.idPublicacion)?.toString() ?? "",
    title: ad.title ?? ad.titulo ?? "Sin título",
    location: ad.city ?? ad.locacion ?? ad.district ?? "Sin locación",
    category:
      ad.category?.name ?? ad.categoria?.nombreCategoria ?? "Sin categoria",
    imagenUrl: ad.image ?? ad.imagenes ?? "",
    datePost: ad.createdAt ?? ad.fechaPublicacion ?? "",
    status: (ad.status ?? ad.estado ?? "ACTIVO") as AdResume["status"],
    owner: ad.user
      ? [ad.user.firstName, ad.user.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        ad.user.email ||
        ""
      : "",
  }));
  return {
    data: mappedAds,
    total: Array.isArray(payload)
      ? payload.length
      : payload?.totalElements ?? mappedAds.length,
    page: Array.isArray(payload)
      ? 1
      : (payload?.page ?? payload?.number ?? 0) + 1,
    limit: Array.isArray(payload) ? mappedAds.length : payload?.size ?? limit,
  };
};

export const getAds = async (
  page = 1,
  limit = 10,
  filters: AdsFilters = {}
): Promise<AdsListResponse> => {
  const res = await axiosInstance.get<SpringPageResponse<PublicacionResponse>>(
    "/ads",
    {
      params: {
        page: page - 1,
        size: limit,
        categoryId: filters.categoryId,
        city: filters.city,
        district: (filters as any).district,
        status: filters.status,
      },
    }
  );

  const springData = res.data;

  const mappedAds: Ads[] = springData.content.map((ad) => {
    const generatedId = `${
      ad.id ?? ad.idPublicacion ?? ad.title ?? Date.now()
    }-${Math.random()}`;
    const userFromNew = ad.user
      ? {
          idUsuario: ad.user.id ?? ad.user.email ?? generatedId,
          nombre:
            [ad.user.firstName, ad.user.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() ||
            ad.user.email ||
            "Usuario",
          email: ad.user.email ?? "",
          rol: undefined,
        }
      : undefined;

    return {
      id: ad.id ?? ad.idPublicacion ?? generatedId,
      title: ad.title ?? ad.titulo ?? "Sin título",
      description:
        ad.description ?? ad.contenido ?? ad.detail ?? "Sin descripción",
      location: ad.city ?? ad.locacion ?? ad.district ?? "Sin ubicación",
      category:
        ad.category?.name ?? ad.categoria?.nombreCategoria ?? "Sin categoría",
      imagenUrl: ad.image ?? ad.imagenes ?? null,
      status: ad.status ?? ad.estado ?? "ACTIVO",
      usuario: userFromNew ?? ad.usuario ?? null,
      createdAt:
        ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
      updatedAt:
        ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
    };
  });

  return {
    data: mappedAds,
    pagination: {
      totalAds: springData.totalElements,
      currentPage: (springData.page ?? springData.number) + 1,
      totalPages: springData.totalPages,
      adsPerPage: springData.size,
    },
  };
};

export const updateAd = async (
  id: string | number,
  data: AdsFormData,
  file?: File
): Promise<Ads> => {
  const formData = new FormData();
  formData.append(
    "ad",
    new Blob(
      [
        JSON.stringify({
          title: data.title,
          description: data.description,
          city: data.city,
          district: data.district,
          categoryId: data.categoryId,
          detail: data.detail ?? "",
          image: null,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (file) {
    formData.append("file", file);
  }
  const res = await axiosInstance.put<PublicacionResponse>(`/ads/${id}`, formData);
  const ad = res.data;
  return {
    id: ad.id ?? id,
    title: ad.title ?? "Sin título",
    description: ad.description ?? ad.detail ?? "",
    location: ad.city ?? ad.locacion ?? ad.district ?? "",
    category: ad.category?.name ?? ad.categoria?.nombreCategoria ?? "",
    imagenUrl: ad.image ?? ad.imagenes ?? null,
    status: ad.status ?? ad.estado ?? "ACTIVO",
    usuario: ad.user ?? ad.usuario ?? null,
    createdAt: ad.createdAt ?? ad.fechaPublicacion ?? "",
    updatedAt: ad.createdAt ?? ad.fechaPublicacion ?? "",
  };
};

export const updateAdStatus = async (
  id: string | number,
  status: string
): Promise<Ads> => {
  const res = await axiosInstance.patch<PublicacionResponse>(
    `/ads/${id}/status`,
    null,
    {
      params: { status },
    }
  );
  const ad = res.data;
  return {
    id: ad.id ?? id,
    title: ad.title ?? "Sin título",
    description: ad.description ?? ad.detail ?? "",
    location: ad.city ?? ad.locacion ?? ad.district ?? "",
    category: ad.category?.name ?? ad.categoria?.nombreCategoria ?? "",
    imagenUrl: ad.image ?? ad.imagenes ?? null,
    status: ad.status ?? ad.estado ?? "",
    usuario: ad.user ?? ad.usuario ?? null,
    createdAt: ad.createdAt ?? ad.fechaPublicacion ?? "",
    updatedAt: ad.createdAt ?? ad.fechaPublicacion ?? "",
  };
};

export const getAdById = async (id: string | number): Promise<Ads | null> => {
  try {
    const res = await axiosInstance.get<PublicacionResponse>(`/ads/${id}`);
    const ad = res.data;

    return {
      id: ad.id ?? ad.idPublicacion ?? id,
      title: ad.title ?? ad.titulo ?? "Sin título",
      description:
        ad.description ?? ad.contenido ?? ad.detail ?? "Sin descripción",
      location: ad.city ?? ad.locacion ?? ad.district ?? "Sin ubicación",
      category:
        ad.category?.name ?? ad.categoria?.nombreCategoria ?? "Sin categoría",
      imagenUrl: ad.image ?? ad.imagenes ?? null,
      usuario: ad.user
        ? {
            idUsuario: ad.user.id ?? ad.user.email ?? id,
            nombre:
              [ad.user.firstName, ad.user.lastName]
                .filter(Boolean)
                .join(" ")
                .trim() ||
              ad.user.email ||
              "Usuario",
            email: ad.user.email ?? "",
            rol: undefined,
          }
        : ad.usuario ?? null,
      district: ad.district ?? "",
      city: ad.city ?? "",
      detail: ad.detail ?? "",
      createdAt:
        ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
      updatedAt:
        ad.createdAt ?? ad.fechaPublicacion ?? new Date().toISOString(),
    } as Ads;
  } catch (error) {
    console.error(`Error fetching ad ID ${id}:`, error);
    return null;
  }
};

const AdService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCommentsByAdId,
  createAd,
  getMyAds,
  getAds,
  getAdById,
  createComment,
};

export default AdService;
