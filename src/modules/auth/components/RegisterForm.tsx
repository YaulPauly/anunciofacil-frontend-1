"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/components/ui/input'; 
import { Button } from '@/shared/components/ui/button'; 
import { Spinner } from '@/shared/components/ui/spinner'; 
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes'; 
import AuthService from '@/modules/auth/services/authService'; 
import { registerSchema, RegisterForm as RegisterFormType } from '@/modules/auth/schemas/registerSchema'; 
import { RegisterData } from '@/types/auth.types';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema) as any,
  });

  const onSubmit = async ({ confirmPassword, ...data }: RegisterFormType) => {
    try {
      const finalData: RegisterData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      await AuthService.register(finalData);
      router.replace(ROUTES.HOME); 
      } catch (error: any) {
      console.error("Error during registration:", error);
      alert("Hubo un error al crear la cuenta. Inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">

        {/* Campo Nombre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="register-firstName">Nombre</label>
          <Input 
            id="register-firstName" 
            type="text" 
            placeholder="Tu Nombre" 
            {...register('firstName')} 
            aria-invalid={errors.firstName ? "true" : "false"} 
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="register-lastName">Apellidos</label>
            <Input 
                id="register-lastName" 
                type="text" 
                placeholder="Tus Apellidos" 
                {...register('lastName')}
                aria-invalid={errors.lastName ? "true" : "false"} 
            />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
        
        {/* Campo Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="register-email">Correo Electrónico</label>
          <Input
            id="register-email"
            placeholder="Correo Electrónico"
            type="email"
            {...register('email')}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Campo Contraseña */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="register-password">Contraseña</label>
          <Input
            id="register-password"
            placeholder="Contraseña (mín. 6 chars)"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {/* Toggle Password Visibility Icon */}
          <button
            type="button"
            className="absolute right-3 top-10"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="register-confirmPassword">Confirmar Contraseña</label>
          <Input
            id="register-confirmPassword"
            placeholder="Repite la Contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {/* Toggle Confirm Password Visibility Icon */}
          <button
            type="button"
            className="absolute right-3 top-10"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        {/* Botón de Submit */}
        <Button variant="default" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner />
              <span>Creando Cuenta...</span>
            </>
          ) : (
            "Regístrate"
          )}
        </Button>
      </div>

      <span className="text-center mt-4">
        ¿Ya tienes una cuenta?{' '}
        <Link href={ROUTES.AUTH.LOGIN} className="text-blue-500 hover:underline">
          Inicia Sesión
        </Link>
      </span>
    </form>
  );
}
