"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useShallow } from "zustand/shallow";

// Agregamos getCategories e importamos la interfaz Category
import { getAds, getCategories } from "@/modules/ads/services/ad.service";
import { AdCard } from "@/modules/ads/components/AdCard";
import PaginationControls from "@/modules/ads/components/PaginationControls";
import { Spinner } from "@/shared/components/ui/spinner";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { AdsListResponse, Category } from "@/types/ads.types";
import { CategoryFilter } from "@/modules/ads/components/CategoryFilter";

interface AdsPageClientProps {
  currentPage: number;
  adsPerPage: number;
}

const buildEmptyResponse = (
  page: number,
  perPage: number
): AdsListResponse => ({
  data: [],
  pagination: {
    totalAds: 0,
    currentPage: page,
    totalPages: 1,
    adsPerPage: perPage,
  },
});

export function AdsPageClient({
  currentPage: initialPage,
  adsPerPage,
}: AdsPageClientProps) {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    page: initialPage,
    categoryId: undefined as number | undefined,
  });

  const [adsData, setAdsData] = useState<AdsListResponse>(() =>
    buildEmptyResponse(filters.page, adsPerPage)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isHydrated } = useAuthStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
    }))
  );

  useEffect(() => {
    getCategories()
      .then(setCategoriesList)
      .catch((err) => console.error("Error cargando categorías", err));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getAds(filters.page, adsPerPage, {
          categoryId: filters.categoryId,
        });

        if (!active) return;
        setAdsData(data);
      } catch (err) {
        console.error("Error fetching ads:", err);
        if (!active) return;

        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError("No tienes permisos para ver los anuncios.");
        } else {
          setError("Hubo un error al cargar los anuncios. Intenta nuevamente.");
        }

        setAdsData(buildEmptyResponse(filters.page, adsPerPage));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [filters, adsPerPage, isHydrated]);

  const ads = adsData.data;
  const pagination = useMemo(() => adsData.pagination, [adsData]);
  const handleCategoryChange = (categoryName: string) => {
    if (categoryName === "all") {
      setFilters((prev) => ({ ...prev, categoryId: undefined, page: 1 }));
      return;
    }
    const selectedCat = categoriesList.find(
      (cat) => cat.name?.toLowerCase() === categoryName.toLowerCase()
    );
    setFilters((prev) => ({
      ...prev,
      categoryId: selectedCat?.id,
      page: 1,
    }));
  };

  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Anuncios Recientes
        </h1>
        <CategoryFilter
          onCategoryChange={handleCategoryChange}
          categories={categoriesList}
        />
      </header>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Spinner className="size-6" />
            <span>Cargando anuncios...</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="border rounded-xl shadow-sm p-3 space-y-3 bg-white"
              >
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : ads.length === 0 ? (
        <div className="p-10 text-center border rounded-lg bg-gray-50">
          <p className="text-xl text-gray-600">
            No se encontraron anuncios para los criterios seleccionados.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          <div className="pt-4 border-t">
            <PaginationControls pagination={pagination} />
          </div>
        </>
      )}
    </div>
  );
}
