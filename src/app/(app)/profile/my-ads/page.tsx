"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useShallow } from "zustand/shallow";
import Link from "next/link";
import { Trash2, RefreshCcw } from "lucide-react";
import ProtectedClient from "@/shared/components/ProtectedClient";
import { ROUTES } from "@/shared/constants/routes";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMyAds, toggleAdStatus } from "@/modules/ads/services/ad.service";
import { Ads } from "@/types/ads.types";

export default function MyAdsPage() {
  const [ads, setAds] = useState<Ads[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const limit = 9;

  const { token, isHydrated } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      isHydrated: state.isHydrated,
    }))
  );

  // Función para cargar los anuncios
  const fetchAds = async () => {
    if (!isHydrated || !token) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAds(); // Usamos tu servicio actualizado
      setAds(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (error) {
      console.error("Error obteniendo anuncios", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError("No tienes permisos para ver tus anuncios.");
      } else {
        setError("Error al cargar tus anuncios. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [token, isHydrated]);
  const handleToggleStatus = async (id: number, currentStatus?: string) => {
    if (!currentStatus || currentStatus === 'INACTIVO') return; 

    const confirmDelete = window.confirm("¿Estás seguro de que deseas desactivar este anuncio?");
    if (!confirmDelete) return;

    setProcessingId(id);
    try {
      await toggleAdStatus(id, 'INACTIVO');

      setAds((prev) =>
        prev.map((ad) => (ad.id === id ? { ...ad, status: 'INACTIVO' } : ad))
      );
      
      alert("Anuncio desactivado correctamente.");
    } catch (error) {
      console.error("Error al desactivar anuncio:", error);
      alert("No se pudo completar la acción. Inténtalo de nuevo.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <ProtectedClient>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mis anuncios</h1>
          <Button variant="outline" size="sm" onClick={fetchAds} disabled={loading}>
            <RefreshCcw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner className="size-10 mb-4" />
            <p className="text-gray-500">Cargando tus publicaciones...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-2xl bg-gray-50">
            <p className="text-slate-600 mb-6 text-lg">No tienes anuncios todavía.</p>
            <Link href={ROUTES.CREATE_AD}>
              <Button size="lg" className="bg-navbar">Publicar mi primer anuncio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((a) => (
              <article
                key={a.id}
                className={`group relative border rounded-xl overflow-hidden bg-white transition-all hover:shadow-md ${
                  a.status === 'INACTIVO' ? 'opacity-60 grayscale' : ''
                }`}
              >
                {/* Badge de Estado */}
                <div className={`absolute top-3 right-3 z-10 px-2 py-1 text-[10px] font-bold rounded-full border shadow-sm ${
                    a.status === 'ACTIVO' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'
                }`}>
                    {a.status}
                </div>

                <div className="relative h-48 w-full bg-slate-100">
                  {a.imagenUrl ? (
                    <img
                      src={a.imagenUrl}
                      alt={a.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Sin imagen</div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-bold text-lg mb-1 truncate" title={a.title}>{a.title}</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    {a.category} · {a.location}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Link
                      href={ROUTES.AD_DETAIL(a.id.toString())}
                      className="text-sm font-semibold text-navbar hover:underline"
                    >
                      Ver detalle
                    </Link>

                    <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 gap-2"
                        onClick={() => handleToggleStatus(Number(a.id), a.status)}
                        disabled={processingId === a.id || a.status === 'INACTIVO'}
                    >
                        {processingId === a.id ? (
                            <Spinner className="size-3" />
                        ) : (
                            <Trash2 className="size-4" />
                        )}
                        {a.status === 'INACTIVO' ? 'Eliminado' : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={ads.length < limit}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </ProtectedClient>
  );
}