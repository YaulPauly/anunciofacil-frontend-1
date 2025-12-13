import React from 'react';
import { Metadata } from 'next';

// Importaciones basadas en archivos provistos
import { getAds } from '@/modules/ads/services/ad.service'; //
import { AdsListResponse } from '@/types/ads.types'; //
import { Spinner } from '@/shared/components/ui/spinner'; //

import { AdCard } from '@/modules/ads/components/AdCard'; 
import PaginationControls from '@/modules/ads/components/PaginationControls'; 


export const metadata: Metadata = {
    title: "Todos los Anuncios",
    description: "Explora todos los anuncios clasificados disponibles en AnuncioFácil.",
};

interface AdsPageProps {
  searchParams: {
    page?: string;
    // Aquí puedes añadir otros filtros, como category o location
  };
}

// Componente de Servidor Asíncrono para el fetching de datos
export default async function AdsPage({ searchParams }: AdsPageProps) {
    const currentPage = parseInt(searchParams.page || '1', 10);
    const adsPerPage = 12; // Cantidad de anuncios a mostrar por página

    let adsData: AdsListResponse;
    let error: string | null = null;
    
    try {
        adsData = await getAds(currentPage, adsPerPage); 
        
    } catch (err) {
        console.error("Error fetching ads:", err);
        error = "Hubo un error al cargar los anuncios. Inténtalo más tarde.";
        
        adsData = {
            data: [], 
            pagination: { totalAds: 0, currentPage: currentPage, totalPages: 1, adsPerPage: adsPerPage }
        };
    }

    const { data: ads, pagination } = adsData;

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
            
            {ads.length === 0 && !error ? (
                <div className="p-10 text-center border rounded-lg bg-gray-50">
                    <p className="text-xl text-gray-600">No se encontraron anuncios para la página actual.</p>
                </div>
            ) : (
                <>
                    {/* Listado de Anuncios */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ads.map((ad) => (
                            <AdCard key={ad.id} ad={ad} />
                        ))}
                    </div>

                    {/* Controles de Paginación */}
                    <div className="pt-4 border-t">
                        <PaginationControls pagination={pagination} />
                    </div>
                </>
            )}
        </div>
    );
}