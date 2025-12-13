"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Importaciones basadas en archivos provistos
import { Button } from '@/shared/components/ui/button'; //
import { AdsListResponse } from '@/types/ads.types'; //

type Pagination = AdsListResponse['pagination'];

interface PaginationControlsProps {
    pagination: Pagination;
}

export default function PaginationControls({ pagination }: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentPage, totalPages, totalAds } = pagination;
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    const navigateToPage = (page: number) => {
        // Mantiene otros filtros (si los hubiera) y solo cambia el parámetro 'page'
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`/ads?${params.toString()}`);
    };

    const handlePrev = () => {
        if (!isFirstPage) {
            navigateToPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            navigateToPage(currentPage + 1);
        }
    };

    if (totalPages <= 1) return null;

    // Lógica simple para mostrar un rango de 5 páginas
    const MAX_PAGES_DISPLAYED = 5;
    let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES_DISPLAYED / 2));
    let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);

    if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
        startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
    }
    
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="flex justify-center items-center space-x-2 p-4">
            
            <Button
                variant="outline"
                size="icon-sm"
                onClick={handlePrev}
                disabled={isFirstPage}
            >
                <ChevronLeft className="size-4" />
            </Button>

            {pages.map(page => (
                <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigateToPage(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline"
                size="icon-sm"
                onClick={handleNext}
                disabled={isLastPage}
            >
                <ChevronRight className="size-4" />
            </Button>
            
            <span className="text-sm text-gray-500 ml-4 hidden sm:inline">
                Mostrando {totalAds} anuncios. Página {currentPage} de {totalPages}.
            </span>
        </div>
    );
}