"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { createCategory } from "@/modules/ads/services/ad.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { ROLES } from "@/shared/constants/roles";
import { useShallow } from "zustand/shallow";
import { Category } from "@/types/ads.types";

type CategoryFormProps = {
  onCreated?: (cat: Category) => void;
};

export function CategoryForm({ onCreated }: CategoryFormProps) {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (user?.role !== ROLES.ADMIN) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const newCat = await createCategory(name.trim(), description.trim());
      setMessage("Categoría creada con éxito.");
      setName("");
      setDescription("");
      onCreated?.(newCat);
    } catch (err) {
      console.error("Error al crear categoría:", err);
      setError("No se pudo crear la categoría. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Crear nueva categoría</h3>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Agregar categoría"}
        </Button>
      </form>
      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default CategoryForm;
