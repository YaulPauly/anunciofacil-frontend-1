import { Metadata } from "next";

import { AdsPageClient } from "./AdsPageClient";

export const metadata: Metadata = {
    title: "Todos los Anuncios",
    description: "Explora todos los anuncios clasificados disponibles en AnuncioFácil.",
};

interface AdsPageProps {
    searchParams: {
        page?: string;
    };
}

export default function AdsPage({ searchParams }: AdsPageProps) {
    const currentPage = parseInt(searchParams.page || "1", 10);
    const adsPerPage = 12;

    return <AdsPageClient currentPage={currentPage} adsPerPage={adsPerPage} />;
}