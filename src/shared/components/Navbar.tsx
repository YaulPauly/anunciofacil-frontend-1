"use client";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { UserProfileMenu } from './UserProfileMenu';

export const Navbar = () => {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="bg-navbar ">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={ROUTES.HOME} className="text-xl font-semibold">
          AnuncioFácil
        </Link>

        <nav className="flex items-center gap-4">
          {!isDashboard && (
            <>
              <Link
                href={user ? ROUTES.CREATE_AD : ROUTES.AUTH.LOGIN}
                className="px-4 py-2 rounded-lg bg-[#3a3a3a] text-white hover:bg-neutral-600 transition-colors"
              >
                Publicar Anuncio
              </Link>
              <Link href={ROUTES.ADS}>Anuncios</Link>
              {user ? (<Link href={ROUTES.PROFILE.MY_ADS}>Mis Anuncios</Link>) : null}
              <Link href={ROUTES.HOME}>Inicio</Link>
            </>
          )}
          {user ? (
            <UserProfileMenu user={user} />
          ) : (
            <Link href={ROUTES.AUTH.LOGIN} className="px-3 py-1 ">
              Acceder
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
