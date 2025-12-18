"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryForm } from "@/modules/ads/components/CategoryForm";
import {
  getCategories,
  updateCategory,
  deleteCategory,
} from "@/modules/ads/services/ad.service";
import type { Category } from "@/types/ads.types";
import { Spinner } from "@/shared/components/ui/spinner";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const getCatId = (cat: Category) =>
    String(cat.id ?? (cat as any).idCategoria ?? "");
  const normalizeId = (id: number | string) => String(id);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        if (!mounted) return;
        setCategories(data ?? []);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        if (!mounted) return;
        setError("No se pudieron cargar las categorías.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const startEdit = (cat: Category) => {
    const id = getCatId(cat);
    if (!id) return;

    setEditingId(id);
    setEditName((cat.name ?? (cat as any).nombreCategoria ?? "").trim());
    setEditDesc(
      (cat.description ?? (cat as any).descripcionCategoria ?? "").trim()
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const name = editName.trim();
    const desc = editDesc.trim();

    if (!name) {
      alert("El nombre es obligatorio.");
      return;
    }

    const current = categories.find((c) => getCatId(c) === editingId);
    const currentName = (
      current?.name ??
      (current as any)?.nombreCategoria ??
      ""
    ).trim();
    const currentDesc = (
      current?.description ??
      (current as any)?.descripcionCategoria ??
      ""
    ).trim();

    // No guardar si no hay cambios
    if (name === currentName && desc === currentDesc) {
      cancelEdit();
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCategory(editingId, name, desc);

      setCategories((prev) =>
        prev.map((cat) => (getCatId(cat) === editingId ? updated : cat))
      );

      cancelEdit();
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      alert("No se pudo actualizar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    const strId = normalizeId(id);
    if (!strId) return;

    if (!confirm("¿Eliminar esta categoría?")) return;

    try {
      await deleteCategory(strId);
      setCategories((prev) => prev.filter((cat) => getCatId(cat) !== strId));

      // Si justo estabas editando esa categoría, limpias el estado
      if (editingId === strId) cancelEdit();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert("No se pudo eliminar la categoría.");
    }
  };

  const hasRows = useMemo(() => categories.length > 0, [categories.length]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Spinner className="size-5" />
                    <span>Cargando categorías...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="px-4 py-6">
                  <p className="text-sm text-red-600">{error}</p>
                </td>
              </tr>
            ) : !hasRows ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-gray-600">
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const catId = getCatId(cat);
                const isEditing = editingId === catId;

                return (
                  <tr key={catId} className="border-t">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="w-full rounded border px-2 py-1 text-sm"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        cat.name ?? (cat as any).nombreCategoria
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {isEditing ? (
                        <input
                          className="w-full rounded border px-2 py-1 text-sm"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                      ) : (
                        cat.description ??
                        (cat as any).descripcionCategoria ??
                        ""
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-60"
                              onClick={saveEdit}
                              disabled={saving}
                            >
                              {saving ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                              className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                              onClick={() => startEdit(cat)}
                            >
                              Editar
                            </button>
                            <button
                              className="rounded-md border px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(catId)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <CategoryForm
        onCreated={(cat) => setCategories((prev) => [...prev, cat])}
      />
    </div>
  );
}
