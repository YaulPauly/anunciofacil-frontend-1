// src/components/anuncios/AnuncioForm.tsx
"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import AdService, { getCategories, createAd }  from '@/modules/ads/services/ad.service';

import { Input } from '@/shared/components/ui/input'; 
import { Button } from '@/shared/components/ui/button'; 
import { Spinner } from '@/shared/components/ui/spinner'; 
import { createAdSchema, CreateAdForm } from '@/modules/ads/schemas/createAdSchema';
import { AdsFormData, Category } from '@/types/ads.types'; 
import { ROUTES } from '@/shared/constants/routes';
import { useEffect, useState } from 'react';


export function AdForm() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CreateAdForm>({
    resolver: yupResolver(createAdSchema) as any,
  });

  useEffect(() => {
        getCategories() 
            .then(data => setCategories(data))
            .catch(error => console.error("Error al cargar categorías:", error))
            .finally(() => setLoadingCategories(false));
    }, []);

  const onSubmit = async (data: CreateAdForm) => {
    try {

      const selectedCategory = categories.find(
        (cat) => cat.idCategoria === Number(data.idCategoria)
      );

      if (!selectedCategory) {
        alert("Selecciona una categoría válida antes de continuar.");
        return;
      }
      const anuncioPayload = {
        titulo: data.title,
        contenido: data.description,
        locacion: data.location,
        idCategoria: Number(data.idCategoria), 
        imagenes: null,
        estado: 'ACTIVO',

      };
      
      await createAd(anuncioPayload as unknown as AdsFormData); 
      alert("¡Anuncio publicado con éxito!");
      router.push(ROUTES.PROFILE.MY_ADS);

    } catch (error) {
      console.error("Error al crear anuncio:", error);
      alert("Hubo un error al publicar el anuncio. Inténtalo de nuevo.");
    }
  };

  

  return (
  <div className="max-w-3xl mx-auto">
    <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-10 rounded-2xl border bg-white p-10 shadow-sm"
>
  {/* Header */}
  <div className="space-y-1">
    <p className="text-sm text-gray-500">
      Completa la información para que tu anuncio sea visible para otros usuarios.
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
        <p className="text-sm text-red-600">
          {errors.title.message}
        </p>
      )}
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Categoría */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          {...register("idCategoria")}
          disabled={loadingCategories || isSubmitting}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <option value="">
            {loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"}
          </option>
          {categories.map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombreCategoria}
            </option>
          ))}
        </select>
        {errors.idCategoria && (
          <p className="text-sm text-red-600">
            {errors.idCategoria.message}
          </p>
        )}
      </div>

      {/* Ubicación */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Ubicación
        </label>
        <Input
          placeholder="Ej: Lima, Miraflores"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-sm text-red-600">
            {errors.location.message}
          </p>
        )}
      </div>
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

  </div>
);

}