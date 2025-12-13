"use client";

import { useEffect, useState, use } from "react";
import { getAdById } from "@/modules/ads/services/ad.service";
import { Ads } from "@/types/ads.types";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { Mail, MapPin } from "lucide-react";
import { CommentSection } from "@/modules/ads/components/CommentSection";
import { useAuthStore } from "@/stores/useAuthStore";

interface AnuncioDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnuncioDetallePage({ params }: AnuncioDetallePageProps) {
  const { id } = use(params);

  const [ad, setAd] = useState<Ads | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    let mounted = true;

    (async () => {
      try {
        const data = await getAdById(id);
        if (!data) setError(true);
        if (mounted) setAd(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, isHydrated]);

  if (!isHydrated || loading) {
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
        <h1 className="text-2xl font-bold text-red-600">
          Anuncio no encontrado
        </h1>
        <p className="mt-2 text-gray-600">
          El ID de anuncio {id} no existe o hubo un error.
        </p>
      </div>
    );
  }

  const seller = ad.usuario;

  return (
    <div className="container mx-auto my-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <img
          src={ad.imagenUrl}
          alt={ad.title}
          className="w-full max-h-[500px] object-cover rounded-xl"
        />

        <h1 className="text-4xl font-extrabold mt-6">{ad.title}</h1>
        <div className="flex items-center text-gray-500 mt-2">
          <MapPin className="size-5 mr-1" />
          {ad.location} · {ad.category}
        </div>

        <p className="mt-6 text-gray-700">{ad.description}</p>

        <div className="mt-10 pt-6 border-t">
          <CommentSection adId={id} />
        </div>
      </div>

      <div className="p-6 bg-white border rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Información del anunciante
        </h3>
        {seller ? (
          <>
            <p className="text-lg text-center">{seller.nombre}</p>
            <p className="text-sm text-center text-gray-500">
              {seller.email}
            </p>
            <Button variant="outline" className="w-full mt-4">
              <Mail className="size-4 mr-2" />
              Enviar mensaje
            </Button>
          </>
        ) : (
          <p className="text-center text-gray-500">
            Sin información de contacto
          </p>
        )}
      </div>
    </div>
  );
}
