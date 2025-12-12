"use client";

import { RegisterForm } from '@/modules/auth/components/RegisterForm'; 
import Image from "next/image";
import RegisterImage from "@/public/register-form-image.jpg";

export default function RegisterPage() {
  return (
    <div className="container mx-auto my-0 flex min-h-screen w-full items-center justify-center p-4">
      <div
        id="registerContainer"
        className="flex max-w-6xl w-full min-h-[600px] items-stretch rounded-xl bg-white shadow-lg overflow-hidden" 
      >
        
        {/* Lado del formulario */}
        <div className="flex flex-col p-8 md:p-16 w-full md:w-1/2">
          <h2 className="mb-6 text-2xl font-semibold text-center">
            Crea tu Cuenta
          </h2>
          <RegisterForm />
        </div>

        <aside 
          className="w-full md:w-1/2 relative hidden md:block order-first md:order-last"
        >
          <span className="absolute bottom-0 left-0 px-6 py-16 text-white text-3xl font-semibold z-20">
            Publica tu primer anuncio
          </span>
          <Image 
            src={RegisterImage} 
            alt="Register Background" 
            fill={true}
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 100vw, 50vw" 
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10"></div>
        </aside>
        
      </div>
    </div>
  );
}