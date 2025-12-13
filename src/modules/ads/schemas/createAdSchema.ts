import { AD_CATEGORIES, AdCategoryType } from '@/shared/constants/categories';
import * as yup from 'yup';

export const createAdSchema = yup.object({
    title: yup.string()
    .min(10, "El título debe ser más descriptivo (mín. 10 caracteres)")
    .max(100, "El título es demasiado largo (máx. 100 caracteres)")
    .required("El título del anuncio es obligatorio"),

    description: yup.string()
    .min(30, "La descripción debe tener al menos 30 caracteres")
    .max(5000, "La descripción es demasiado larga (máx. 5000 caracteres)")
    .required("La descripción del anuncio es obligatoria"),

    location: yup.string()
    .max(50, "La ubicación es demasiado larga (máx. 50 caracteres)")
    .required("La ubicación del anuncio es obligatoria"),

    category: yup.string<AdCategoryType>()
    .oneOf(AD_CATEGORIES as ReadonlyArray<AdCategoryType>, "Categoría inválida")
    .required("La categoría del anuncio es obligatoria"),


}).required();

export type CreateAdForm = yup.InferType<typeof createAdSchema>; 