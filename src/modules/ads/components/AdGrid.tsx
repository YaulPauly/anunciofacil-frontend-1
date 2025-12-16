"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AdCard } from '@/modules/ads/components/AdCard';
import  PaginationControls  from './PaginationControls';
import { getAds } from '@/modules/ads/services/ad.service';
import { Spinner } from '@/shared/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';

type AdsListResponse = Awaited<ReturnType<typeof getAds>>;
type AdItem = AdsListResponse['data'][number];

interface AdGridProps {
    initialAds: AdsListResponse;
}

const ADS_PER_PAGE = 10; 

export const AdGrid: React.FC<AdGridProps> = ({ initialAds }) => {
    const [adsResponse, setAdsResponse] = useState<AdsListResponse>(initialAds);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialAds.pagination.currentPage);

    const fetchAds = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAds(page, ADS_PER_PAGE);
            setAdsResponse(data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching ads:", err);
            setError("No se pudieron cargar los anuncios. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (initialAds.data.length === 0 && !loading) {
             fetchAds(1); 
        }
    }, [initialAds.data.length, loading, fetchAds]);


    const handlePageChange = (newPage: number) => {
        if (newPage !== currentPage) {
            fetchAds(newPage);
        }
    };

    if (error) {
        return (
            <div className="text-center p-8 border rounded-lg bg-red-50/50">
                <AlertTriangle className="size-8 text-red-600 mx-auto mb-2" />
                <p className="text-lg text-red-700">{error}</p>
            </div>
        );
    }
    
    if (loading && adsResponse.data.length === 0) {
        return (
             <div className="flex justify-center items-center h-64">
                <Spinner className="size-10 text-primary" />
                <p className="ml-2">Cargando anuncios...</p>
            </div>
        );
    }

    if (adsResponse.data.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-700">No hay anuncios disponibles.</h2>
                <p className="text-gray-500 mt-2">Sé el primero en publicar algo interesante.</p>
            </div>
        );
    }


    return (
        <div className="space-y-10 w-full container mx-auto gap-6">
            {loading && (
                <div className="flex justify-center items-center py-4">
                    <Spinner className="size-6 text-primary" />
                    <p className="ml-2 text-sm text-gray-500">Actualizando...</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {adsResponse.data.map((ad: AdItem) => (
                    <AdCard key={ad.id} ad={ad} /> 
                ))}
            </div>
            

            <div className="flex justify-center">
                <PaginationControls
                    pagination={adsResponse.pagination}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                />
            </div>
        </div>
    );
};