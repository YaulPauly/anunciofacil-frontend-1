"use client";

import { useEffect, useState } from "react";
import {
  getAds,
  updateAdStatus,
  getAdById,
  updateAd,
  getCategories,
} from "@/modules/ads/services/ad.service";
import { AdsListResponse, Category } from "@/types/ads.types";
import { Spinner } from "@/shared/components/ui/spinner";
import axios from "axios";

export default function AdminAdsPage() {
  const [adsResponse, setAdsResponse] = useState<AdsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    city: "",
    district: "",
    categoryId: "",
    detail: "",
    imageUrl: null as string | null,
  });
  const [file, setFile] = useState<File | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAds(1, pageSize, {});
        if (!mounted) return;
        setAdsResponse(res);
      } catch (err) {
        console.error("Error al cargar anuncios:", err);
        if (!mounted) return;
        const msg =
          axios.isAxiosError(err) && err.response?.status === 403
            ? "No tienes permisos para ver los anuncios."
            : "No se pudieron cargar los anuncios.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [pageSize]);

  const toggleStatus = async (
    adId: string | number,
    currentStatus?: string
  ) => {
    const nextStatus = currentStatus === "INACTIVO" ? "ACTIVO" : "INACTIVO";
    setUpdatingId(adId);
    try {
      const updated = await updateAdStatus(adId, nextStatus);
      setAdsResponse((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((ad) =>
                ad.id === adId ? { ...ad, status: updated.status as any } : ad
              ),
            }
          : prev
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo actualizar el estado del anuncio.");
    } finally {
      setUpdatingId(null);
    }
  };

  const ads = adsResponse?.data ?? [];

  const startEdit = async (adId: string | number) => {
    setEditingId(adId);
    setError(null);
    try {
      const [ad, cats] = await Promise.all([getAdById(adId), getCategories()]);
      setCategories(cats);
      if (ad) {
        setEditForm({
          title: ad.title ?? "",
          description: ad.description ?? "",
          city: ad.city ?? "",
          district: ad.district ?? "",
          categoryId:
            cats
              .find(
                (c) =>
                  c.name === ad.category || c.nombreCategoria === ad.category
              )
              ?.id?.toString() ??
            cats
              .find((c) => c.nombreCategoria === ad.category)
              ?.idCategoria?.toString() ??
            "",
          detail: ad.detail ?? "",
          imageUrl: ad.imagenUrl ?? null,
        });
        setFile(undefined);
      }
    } catch (err) {
      console.error("Error al cargar anuncio:", err);
      setError("No se pudo cargar el anuncio para edición.");
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      const updated = await updateAd(
        editingId,
        {
          title: editForm.title,
          description: editForm.description,
          city: editForm.city,
          district: editForm.district,
          categoryId: Number(editForm.categoryId),
          detail: editForm.detail,
          image: editForm.imageUrl,
        },
        file
      );
      setAdsResponse((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((ad) =>
                ad.id === editingId
                  ? {
                      ...ad,
                      title: updated.title,
                      description: updated.description,
                      location: updated.location,
                      category: updated.category,
                    }
                  : ad
              ),
            }
          : prev
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error al actualizar anuncio:", err);
      setError("No se pudo actualizar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Anuncios</h1>
      </div>
      {!editingId ? (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Propietario</th>
                <th className="px-4 py-3">Ciudad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-t">
                  <td className="px-4 py-3">{ad.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {ad.usuario && "nombre" in ad.usuario
                      ? ad.usuario.nombre
                      : ""}
                  </td>
                  <td className="px-4 py-3">{ad.location}</td>
                  <td className="px-4 py-3">{ad.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                        onClick={() => startEdit(ad.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                        onClick={() => toggleStatus(ad.id, ad.status)}
                        disabled={updatingId === ad.id}
                      >
                        {updatingId === ad.id
                          ? "Actualizando..."
                          : ad.status === "INACTIVO"
                          ? "Activar"
                          : "Inactivar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="max-w-3xl space-y-4 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">Editar anuncio</h2>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <form onSubmit={submitEdit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Título</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Imagen</label>
              <div
                className="rounded border border-dashed px-4 py-6 text-center text-sm text-gray-600 hover:border-gray-400 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setFile(f);
                }}
              >
                <p className="mb-2">
                  Arrastra y suelta una imagen o haz clic para seleccionar
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-input-ad"
                  onChange={(e) => setFile(e.target.files?.[0])}
                />
                <label
                  htmlFor="file-input-ad"
                  className="underline cursor-pointer"
                >
                  Seleccionar archivo
                </label>
                {file && (
                  <p className="mt-2 text-xs text-gray-700">
                    Archivo: {file.name}
                  </p>
                )}
                {!file && editForm.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={editForm.imageUrl}
                      alt="Imagen actual"
                      className="mx-auto h-32 w-auto object-cover rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Imagen actual (puedes reemplazarla subiendo otra)
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                className="w-full rounded border px-3 py-2 text-sm"
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Ciudad</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Distrito</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={editForm.district}
                  onChange={(e) =>
                    setEditForm({ ...editForm, district: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Detalle</label>
              <textarea
                className="w-full rounded border px-3 py-2 text-sm"
                rows={2}
                value={editForm.detail}
                onChange={(e) =>
                  setEditForm({ ...editForm, detail: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Categoría</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
              >
                <option value="">Selecciona</option>
                {categories.map((cat) => (
                  <option
                    key={cat.id ?? cat.idCategoria}
                    value={cat.id ?? cat.idCategoria}
                  >
                    {cat.name ?? cat.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setEditingId(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner className="size-5" />
          <span>Cargando anuncios...</span>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
