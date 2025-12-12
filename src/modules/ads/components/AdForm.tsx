// src/components/anuncios/AnuncioForm.tsx (NUEVO)
"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import { Input } from '@/shared/components/ui/input'; 
import { Button } from '@/shared/components/ui/button'; 
import { Spinner } from '@/shared/components/ui/spinner'; 
import { createAdSchema, CreateAdForm } from '@/modules/ads/schemas/createAdSchema';
import { createAd } from '@/modules/ads/services/ad.service';
import { AdsFormData } from '@/types/ads.types'; 
import { ROUTES } from '@/shared/constants/routes';

export function AdForm() {
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CreateAdForm>({
    resolver: yupResolver(createAdSchema) as any,
  });

  const onSubmit = async (data: CreateAdForm) => {
    try {
      // 1. Convertir precio de string/number a number si es necesario (Yup ya lo hace)
      const anuncioData: AdsFormData = {
        ...data
      };

      // 2. Llamada al servicio
      await createAd(anuncioData);
      
      // 3. Éxito: Redirigir a mis anuncios
      alert("¡Anuncio publicado con éxito!");
      router.push(ROUTES.PROFILE.MY_ADS);

    } catch (error) {
      console.error("Error al crear anuncio:", error);
      alert("Hubo un error al publicar el anuncio. Inténtalo de nuevo.");
    }
  };

  const categories = ['empleos', 'bienes', 'inmuebles', 'autos', 'servicios', 'otro'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Título */}
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Anuncio</label>
            <Input 
                id="title" 
                placeholder="Ej: Vendo automóvil Toyota Corolla en excelente estado" 
                {...register('title')} 
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className='grid grid-cols-2 gap-6'>
            {/* Categoría */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                    id="category"
                    {...register('category')}
                    className="h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs"
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            {/* Ubicación */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación (Ciudad/Zona)</label>
                <Input 
                    id="location" 
                    placeholder="Ej: Lima, Miraflores" 
                    {...register('location')} 
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
        </div>

        {/* Descripción */}
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción Detallada</label>
            <textarea
                id="description"
                rows={6}
                placeholder="Describe el estado, características y detalles de contacto..."
                {...register('description')}
                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Botón de Submit */}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
              <>
                  <Spinner />
                  <span>Publicando Anuncio...</span>
              </>
          ) : (
              "Publicar Anuncio Ahora"
          )}
        </Button>
    </form>
  );
}