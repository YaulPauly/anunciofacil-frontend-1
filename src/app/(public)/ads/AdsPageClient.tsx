"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useShallow } from "zustand/shallow";

import { getAds } from "@/modules/ads/services/ad.service";
import type { AdsListResponse } from "@/types/ads.types";
import { AdCard } from "@/modules/ads/components/AdCard";
import PaginationControls from "@/modules/ads/components/PaginationControls";
import { Spinner } from "@/shared/components/ui/spinner";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdsPageClientProps {
    currentPage: number;
    adsPerPage: number;
}

const buildEmptyResponse = (page: number, perPage: number): AdsListResponse => ({
    data: [],
    pagination: {
        totalAds: 0,
        currentPage: page,
        totalPages: 1,
        adsPerPage: perPage,
    },
});

export function AdsPageClient({ currentPage, adsPerPage }: AdsPageClientProps) {
    const [adsData, setAdsData] = useState<AdsListResponse>(() => buildEmptyResponse(currentPage, adsPerPage));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isHydrated } = useAuthStore(useShallow((state) => ({
        isHydrated: state.isHydrated,
    })));

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const data = await getAds(currentPage, adsPerPage);
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
                setAdsData(buildEmptyResponse(currentPage, adsPerPage));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [currentPage, adsPerPage, isHydrated]);

    const ads = adsData.data;
    const pagination = useMemo(() => adsData.pagination, [adsData]);

    return (
        <div className="space-y-8 container mx-auto px-4 py-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Anuncios Recientes</h1>
            </header>

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                    <Spinner className="size-6" />
                    <span>Cargando anuncios...</span>
                </div>
            ) : ads.length === 0 ? (
                <div className="p-10 text-center border rounded-lg bg-gray-50">
                    <p className="text-xl text-gray-600">No se encontraron anuncios para la página actual.</p>
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
