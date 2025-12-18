"use client";

import { useEffect, useState, use, useMemo } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { Mail, MapPin, Pencil } from "lucide-react";
import { CommentSection } from "@/modules/ads/components/CommentSection";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { useShallow } from "zustand/shallow";
import { Ads, AdUsuario } from "@/types/ads.types";
import { getAdById } from "@/modules/ads/services/ad.service";

interface AnuncioDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}
const PLACEHOLDER_IMAGE = "/no-image.png";

export default function AnuncioDetallePage({
  params,
}: AnuncioDetallePageProps) {
  const { id } = use(params);

  const [ad, setAd] = useState<Ads | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imageUrl = ad?.imagenUrl ? ad.imagenUrl : PLACEHOLDER_IMAGE;
  const { user, isHydrated } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isHydrated: state.isHydrated,
    }))
  );

  const isOwner = useMemo(() => {
    if (!user || !ad?.usuario) return false;
    const adUserId = (ad.usuario as AdUsuario).idUsuario;
    return String(user.id) === String(adUserId);
  }, [user, ad]);

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
  const sellerNombre = seller && "nombre" in seller ? seller.nombre : "Usuario";
  const sellerEmail = seller && "email" in seller ? seller.email : "";

  return (
    <div className="container mx-auto my-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="relative w-full h-[700px] overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={ad.title}
            fill={true}
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>

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
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <Image
                src="/no-userimage.png"
                alt={`Imagen de ${sellerNombre ?? "anunciante"}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-lg text-center">{sellerNombre}</p>
            <p className="text-sm text-center text-gray-500">{sellerEmail}</p>
            {isOwner ? (
              <Link href={ROUTES.PROFILE.MY_ADS} className="w-full mt-4 block">
                <Button variant="default" className="w-full">
                  <Pencil className="size-4 mr-2" />
                  Editar Anuncio
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-4"
                disabled={!user}
              >
                <Mail className="size-4 mr-2" />
                {user ? "Enviar mensaje" : "Inicia sesión para contactar"}
              </Button>
            )}
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
