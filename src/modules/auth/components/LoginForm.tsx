"use client";

// --- Hooks y Librerías de Formulario ---
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

// --- UI y Constantes ---
import { Input } from '@/shared/components/ui/input'; 
import { Button } from '@/shared/components/ui/button'; 
import { Spinner } from '@/shared/components/ui/spinner'; 
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes'; 
import { useUIStore } from '@/stores/ui.store';

// --- Lógica del Módulo ---
import AuthService from '@/modules/auth/services/authService'; 
import { loginSchema, loginForm as LoginFormType } from '@/modules/auth/schemas/loginSchema'; 
import { LoginData } from '@/types/auth.types'; 

export function LoginForm() {
    const router = useRouter();

    const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema) as any,
  });

  
  const onSubmit = async (data: LoginFormType) => {
    try {
        await AuthService.login(data as LoginData);
        router.replace(ROUTES.HOME);
    } catch (error: any){
        console.error('Error during login:', error);
        const errorMessage = error?.response?.data?.message || "Credenciales inválidas o error de red.";

        setError("email", { type: "manual", message: errorMessage });
    }
  };

  return (
    <form onSubmit= {handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Campo Correo electrónico*/ }
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <label htmlFor="login-email">Correo Electrónico</label>
                <Input id='login-email' placeholder='Correo electrónico' type='email' {...register("email")} aria-invalid={errors.email ? "true" : "false"} />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
        </div>
        {/* Campo Contraseña*/ }
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password">Contraseña</label>
          <Input
            id="login-password"
            placeholder="Contraseña"
            type="password"
            {...register('password')}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <Button variant={"default"} type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
              <>
                  <Spinner />
                  <span>Iniciando Sesión...</span>
              </>
          ) : (
              "Iniciar Sesión"
          )}
        </Button>
        <span className="text-center mt-4">
        ¿Aun no tienes una cuenta?{' '}
        <Link href={ROUTES.AUTH.REGISTER} className="text-blue-500 hover:underline">
          Regístrate
        </Link>
      </span>
    </form>
)


}