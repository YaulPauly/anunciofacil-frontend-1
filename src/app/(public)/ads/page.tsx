import { Metadata } from "next";

import { AdsPageClient } from "./AdsPageClient";

export const metadata: Metadata = {
    title: "Todos los Anuncios",
    description: "Explora todos los anuncios clasificados disponibles en AnuncioFácil.",
};

interface AdsPageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function AdsPage({ searchParams }: AdsPageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params?.page || "1", 10);
    const adsPerPage = 12;

    return <AdsPageClient currentPage={currentPage} adsPerPage={adsPerPage} />;
}
