import * as yup from 'yup';

export const createAdSchema = yup.object({
    categoryId: yup.number() 
        .required('La categoría es obligatoria')
        .integer('Debe ser un ID de categoría válido')
        .min(1, 'Selecciona una categoría válida'),
    title: yup.string().required('El título es obligatorio').min(3),
    description: yup.string().required('La descripción es obligatoria').min(10),
    city: yup.string().required('La ciudad es obligatoria'),
    district: yup.string().required('El distrito es obligatorio'),
    detail: yup.string().nullable(),
}).required();

export type CreateAdForm = yup.InferType<typeof createAdSchema>; 
