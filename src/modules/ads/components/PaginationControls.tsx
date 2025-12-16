"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button'; //
import { AdsListResponse } from '@/types/ads.types'; //

type Pagination = AdsListResponse['pagination'];

interface PaginationControlsProps {
    pagination: Pagination;
    onPageChange?: (page: number) => void | Promise<void>;
    isLoading?: boolean;
    targetPath?: string;
}

export default function PaginationControls({ pagination, onPageChange, isLoading = false, targetPath }: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { currentPage, totalPages, totalAds } = pagination;
    const basePath = targetPath || pathname || '/ads';
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    const navigateToPage = (page: number) => {
        if (page === currentPage || isLoading) return;
        if (onPageChange) {
            onPageChange(page);
            return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        const queryString = params.toString();
        router.push(queryString ? `${basePath}?${queryString}` : basePath);
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
                disabled={isFirstPage || isLoading}
            >
                <ChevronLeft className="size-4" />
            </Button>

            {pages.map(page => (
                <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigateToPage(page)}
                    disabled={page === currentPage || isLoading}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline"
                size="icon-sm"
                onClick={handleNext}
                disabled={isLastPage || isLoading}
            >
                <ChevronRight className="size-4" />
            </Button>
            
            <span className="text-sm text-gray-500 ml-4 hidden sm:inline">
                Mostrando {totalAds} anuncios. Página {currentPage} de {totalPages}.
            </span>
        </div>
    );
}