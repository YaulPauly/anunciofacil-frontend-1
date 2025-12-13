"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { getAdById } from '@/modules/ads/services/ad.service';
import { Ads } from '@/types/ads.types';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { CommentSection } from '@/modules/ads/components/CommentSection';

interface AnuncioDetallePageProps {
    params: {
        id: string; 
    }
}

export default function AnuncioDetallePage({ params }: AnuncioDetallePageProps) {
    const [ad, setAd] = useState<Ads | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', { 
            style: 'currency', 
            currency: 'PEN', 
            minimumFractionDigits: 0 
        }).format(price);
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(false);
        
        (async () => {
            try {
                const data = await getAdById(params.id);
                if (mounted) {
                    if (!data) {
                        setError(true);
                        // notFound();
                    }
                    setAd(data);
                }
            } catch (err) {
                if (mounted) {
                    console.error("Error fetching ad:", err);
                    setError(true);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [params.id]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner className="size-10 text-primary" />
                <p className="ml-2">Cargando anuncio...</p>
            </div>
        );
    }

    if (error || !ad) {
        return (
            <div className="text-center p-10 border rounded-lg bg-red-50/50">
                <h1 className="text-2xl font-bold text-red-600">Anuncio no encontrado</h1>
                <p className="mt-2 text-gray-600">El ID de anuncio {params.id} no existe o hubo un error de conexión.</p>
            </div>
        );
    }
    
    // Renderizado del Anuncio
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <img 
                    src={ad.imagenUrl} 
                    alt={ad.title} 
                    className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-md"
                />

                <div className="mt-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">{ad.title}</h1>
                    <div className="flex items-center text-gray-500 mt-2">
                        <MapPin className="size-5 mr-1" />
                        <span>{ad.location} · {ad.category}</span>
                    </div>

                    <h2 className="text-2xl font-bold mt-6 mb-3">Descripción</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
                    
                    {/* Sección de Comentarios (Placeholder) */}
                    <div className="mt-10 pt-6 border-t">
                        <CommentSection adId={params.id} />
                    </div>
                </div>
            </div>


            <div className="lg:col-span-1 space-y-6">

                {/* Caja del Vendedor */}
                <div className="p-6 bg-white border rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-center">Información del anunciante</h3>
                    <p className="text-lg font-medium text-center">{ad.usuario.nombre}</p>
                    <p className="text-sm text-gray-500 mb-4 text-center">Correo: {ad.usuario.email}</p>
                    
                    <Button variant="outline" className="w-full mt-2">
                        <Mail className="size-4 mr-2" />
                        Enviar mensaje
                    </Button>
                </div>
            </div>
        </div>
    );
}