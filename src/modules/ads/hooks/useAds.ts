import { useCallback, useState } from "react";
import {
  createAd,
  createComment,
  getAdById,
  getAds,
  getCategories,
  getCommentsByAdId,
  getMyAds,
} from "@/modules/ads/services/ad.service";
import {
  Ads,
  AdsFormData,
  AdsListResponse,
  Category,
  CommentsListResponse,
} from "@/types/ads.types";

type AdsFilters = Parameters<typeof getAds>[2];

export const useAds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withState = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Error inesperado";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAds = useCallback(
    (
      page = 1,
      limit = 10,
      filters: AdsFilters = {}
    ): Promise<AdsListResponse> =>
      withState(() => getAds(page, limit, filters)),
    [withState]
  );

  const fetchAdById = useCallback(
    (id: string | number): Promise<Ads | null> =>
      withState(() => getAdById(id)),
    [withState]
  );

  const fetchMyAds = useCallback(
    (page = 1, limit = 9) => withState(() => getMyAds(page, limit)),
    [withState]
  );

  const fetchCategories = useCallback(
    (): Promise<Category[]> => withState(() => getCategories()),
    [withState]
  );

  const fetchCommentsByAdId = useCallback(
    (adId: string, page = 1, limit = 5): Promise<CommentsListResponse> =>
      withState(() => getCommentsByAdId(adId, page, limit)),
    [withState]
  );

  const postComment = useCallback(
    (adId: number, content: string) =>
      withState(() => createComment(adId, content)),
    [withState]
  );

  const postAd = useCallback(
    (data: AdsFormData, file?: File): Promise<Ads> => withState(() => createAd(data, file)),
    [withState]
  );

  return {
    loading,
    error,
    fetchAds,
    fetchAdById,
    fetchMyAds,
    fetchCategories,
    fetchCommentsByAdId,
    postComment,
    postAd,
  };
};

export default useAds;
