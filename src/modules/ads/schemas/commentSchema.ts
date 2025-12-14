import * as yup from 'yup';

export const commentSchema = yup.object({
    content: yup.string()
        .required('El comentario es obligatorio')
        .min(2, 'El comentario debe tener al menos 2 caracteres')
        .max(500, 'El comentario no puede exceder los 500 caracteres'),
}).required();

export type CommentForm = yup.InferType<typeof commentSchema>;