"use client";

import { useEffect, useState } from "react";
import ProtectedClient from "@/shared/components/ProtectedClient";
import { getMyAds, AdResume } from "@/modules/ads/services/ad.service";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { Spinner } from "@/shared/components/ui/spinner";



export default function MyAdsPage() {

    const [ads, setAds] = useState<AdResume[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const limit = 9;

    useEffect(()=> {
        let mounted = true;
        setLoading(true);
        (async () => {
            try {
                const res = await getMyAds(page, limit);
                if(!mounted) return;
                setAds(res.data ?? []);
                setTotal(res.total ?? 0);
            } catch (error) {
                console.error("Error obteniendo anuncios", error);
            } finally {
                if(mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    },[page]);


    return (
    <ProtectedClient>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Mis anuncios</h1>
          <Link href={ROUTES.ADS + "/create"} className="px-3 py-2 bg-blue-600 text-white rounded">
            Publicar anuncio
          </Link>
        </div>

        {loading ? (
          <div><Spinner/>Loading...</div>
        ) : ads.length === 0 ? (
          <div className="p-6 text-center text-slate-600">
            No tienes anuncios todavía. <Link href={ROUTES.ADS + "/create"} className="text-blue-600">Publicar uno</Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {ads.map((a) => (
              <article key={a.id} className="border rounded p-4">
                {a.imagenUrl && <img src={a.imagenUrl} alt={a.title} className="h-40 w-full object-cover mb-2 rounded" />}
                <h2 className="font-semibold">{a.title}</h2>
                <p className="text-sm text-slate-600">{a.category} · {a.location}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(a.datePost).toLocaleString()}</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-2 py-1 border rounded text-sm">Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
          <span>Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={ads.length < limit} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </ProtectedClient>
  );
}

