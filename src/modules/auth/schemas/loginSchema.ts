import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
}).required();

export type loginForm = yup.InferType<typeof loginSchema>;