import { AD_CATEGORIES, AdCategoryType } from '@/shared/constants/categories';
import * as yup from 'yup';

export const createAdSchema = yup.object({
    idCategoria: yup.number() 
        .required('La categoría es obligatoria')
        .integer('Debe ser un ID de categoría válido')
        .min(1, 'Selecciona una categoría válida'),

    title: yup.string().required('El título es obligatorio').min(3),
    description: yup.string().required('La descripción es obligatoria').min(10),
    location: yup.string().required('La ubicación es obligatoria'),


}).required();

export type CreateAdForm = yup.InferType<typeof createAdSchema>; 