// src/components/anuncios/AnuncioForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  createAdSchema,
  CreateAdForm,
} from "@/modules/ads/schemas/createAdSchema";
import { ROUTES } from "@/shared/constants/routes";
import { useEffect, useState } from "react";
import { AdsFormData, Category } from "@/types/ads.types";
import { createAd, createCategory, getCategories } from "../services/ad.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useShallow } from "zustand/shallow";
import { ROLES } from "@/shared/constants/roles";
import { ImageUpload } from "./ImageUpload";

export function AdForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDescription, setNewCatDescription] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const { user, isHydrated } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isHydrated: state.isHydrated,
    }))
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdForm>({
    resolver: yupResolver(createAdSchema) as any,
  });

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error al cargar categorías:", error))
      .finally(() => setLoadingCategories(false));
  }, []);

  const onSubmit = async (data: CreateAdForm) => {
    try {
      const selectedCategory = categories.find(
        (cat) =>
          (cat.id ?? cat.idCategoria) === Number(data.categoryId)
      );

      if (!selectedCategory) {
        alert("Selecciona una categoría válida antes de continuar.");
        return;
      }
      const anuncioPayload: AdsFormData = {
        title: data.title,
        description: data.description,
        city: data.city,
        district: data.district,
        categoryId: Number(data.categoryId),
        detail: data.detail ?? undefined,
        image: file ? file.name : null,
      };
      await createAd(anuncioPayload, file);
      alert("¡Anuncio publicado con éxito!");
      router.push(ROUTES.PROFILE.MY_ADS);
    } catch (error) {
      console.error("Error al crear anuncio:", error);
      alert("Hubo un error al publicar el anuncio. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
         {" "}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 rounded-2xl border bg-white p-10 shadow-sm"
      >
        {/* Header */}
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Completa la información para que tu anuncio sea visible para otros
            usuarios.
          </p>
        </div>

        {/* Información principal */}
        <div className="space-y-6">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Título del anuncio
            </label>
            <Input
              placeholder="Ej: Toyota Corolla 2020 en excelente estado"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              {...register("categoryId")}
              disabled={loadingCategories || isSubmitting}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">
                {loadingCategories
                  ? "Cargando categorías..."
                  : "Selecciona una categoría"}
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id ?? cat.idCategoria}
                  value={cat.id ?? cat.idCategoria}
                >
                  {cat.name ?? cat.nombreCategoria}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Ciudad
              </label>
              <Input
                placeholder="Ej: Lima"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Distrito
              </label>
              <Input
                placeholder="Ej: Miraflores"
                {...register("district")}
              />
              {errors.district && (
                <p className="text-sm text-red-600">
                  {errors.district.message}
                </p>
              )}
            </div>
          </div>

          {isHydrated && user?.role === ROLES.ADMIN && (
            <div className="space-y-3 rounded-lg border p-4 bg-gray-50">
              <p className="text-sm font-semibold">Crear nueva categoría</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nombre"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  disabled={creatingCategory}
                />
                <Input
                  placeholder="Descripción"
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  disabled={creatingCategory}
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  if (!newCatName.trim()) return;
                  setCreatingCategory(true);
                  try {
                    const newCat = await createCategory(
                      newCatName.trim(),
                      newCatDescription.trim()
                    );
                    setCategories((prev) => [...prev, newCat]);
                    setNewCatName("");
                    setNewCatDescription("");
                  } catch (error) {
                    console.error("Error al crear categoría:", error);
                    alert("No se pudo crear la categoría.");
                  } finally {
                    setCreatingCategory(false);
                  }
                }}
                disabled={creatingCategory}
              >
                {creatingCategory ? "Creando..." : "Agregar categoría"}
              </Button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Detalle
            </label>
            <textarea
              rows={2}
              placeholder="Información adicional"
              {...register("detail")}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.detail && (
              <p className="text-sm text-red-600">
                {errors.detail.message as string}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              rows={5}
              placeholder="Describe el estado, características y detalles importantes del anuncio..."
              {...register("description")}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <ImageUpload
              value={file}
              onChange={(file) => setFile(file ?? undefined)}
            />
          </div>
        </div>

        {/* Acción */}
        <div className="pt-6 border-t">
          <Button
            type="submit"
            size="lg"
            className="w-full bg-navbar"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Publicando anuncio...</span>
              </div>
            ) : (
              "Publicar anuncio"
            )}
          </Button>
        </div>
      </form>
       {" "}
    </div>
  );
}
