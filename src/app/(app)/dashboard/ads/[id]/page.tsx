"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdById, getCategories, updateAd } from "@/modules/ads/services/ad.service";
import { Category } from "@/types/ads.types";
import { Spinner } from "@/shared/components/ui/spinner";

export default function AdminEditAdPage() {
  const params = useParams();
  const router = useRouter();
  const adId = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    district: "",
    categoryId: "",
    detail: "",
  });
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ad, cats] = await Promise.all([getAdById(adId), getCategories()]);
        if (!mounted) return;
        setCategories(cats);
        if (ad) {
          setForm({
            title: ad.title ?? "",
            description: ad.description ?? "",
            city: ad.location ?? "",
            district: "",
            categoryId: cats.find((c) => c.name === ad.category || c.nombreCategoria === ad.category)?.id?.toString() ??
              cats.find((c) => c.nombreCategoria === ad.category)?.idCategoria?.toString() ??
              "",
            detail: "",
          });
        }
      } catch (err) {
        console.error("Error al cargar anuncio:", err);
        if (!mounted) return;
        setError("No se pudo cargar el anuncio.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [adId]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateAd(
        adId,
        {
          title: form.title,
          description: form.description,
          city: form.city,
          district: form.district,
          categoryId: Number(form.categoryId),
          image: null,
          detail: form.detail,
        },
        file
      );
      router.push("/dashboard/ads");
    } catch (err) {
      console.error("Error al actualizar anuncio:", err);
      setError("No se pudo actualizar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner className="size-5" />
        <span>Cargando anuncio...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Editar anuncio</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-sm font-medium">Título</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full rounded border px-3 py-2 text-sm"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Ciudad</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Distrito</label>
            <input
              name="district"
              value={form.district}
              onChange={onChange}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Detalle</label>
          <textarea
            name="detail"
            value={form.detail}
            onChange={onChange}
            className="w-full rounded border px-3 py-2 text-sm"
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Categoría</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id ?? cat.idCategoria} value={cat.id ?? cat.idCategoria}>
                {cat.name ?? cat.nombreCategoria}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Imagen</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? "Actualizando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
