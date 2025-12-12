import * as yup from 'yup';

export const registerSchema = yup.object({
  nombre: yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  email: yup.string()
    .email("Debe ser un correo electrónico válido")
    .required("El email es obligatorio"),
  password: yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña'),
}).required();

export type RegisterForm = yup.InferType<typeof registerSchema>;