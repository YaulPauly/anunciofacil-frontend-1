import LoginImage from "@/public/login-form-image.jpg";
import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import { Input } from "@/shared/components/ui/input";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto my-0 flex min-h-screen w-full items-center justify-center p-4">
      <div
        id="loginContainer"
        className="flex max-w-6xl w-full min-h-[600px] items-stretch rounded-xl bg-white shadow-lg overflow-hidden" 
      >
        <aside className="w-full md:w-1/2 relative hidden md:block">
          <span className="absolute bottom-0 left-0 px-6 py-16 text-white text-3xl font-semibold z-20">
            Anuncia como un profesional
          </span>
          <Image 
            src={LoginImage} 
            alt="Login Background" 
            fill={true}
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 100vw, 50vw" 
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10"></div>
        </aside>
        
        <div className="flex flex-col p-8 md:p-16 w-full md:w-1/2">
          <h2 className="mb-6 text-2xl font-semibold text-center">
            Accede a tu cuenta
          </h2>

          <LoginForm />

        </div>
      </div>
    </div>
  );
}