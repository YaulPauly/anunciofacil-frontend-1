"use client";
import React, { use } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { ROLES } from '@/shared/constants/roles'

export const Navbar = () => {
  const user = useAuthStore((s) => s.user)

  return(
    <header className='bg-navbar '>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={ROUTES.HOME} className="text-xl font-semibold">
          AnuncioFácil
        </Link>

        <nav className="flex items-center gap-4">
          <Link href={user ? ROUTES.CREATE_AD : ROUTES.AUTH.LOGIN} className="px-4 py-2 rounded-lg bg-[#3a3a3a] text-white hover:bg-neutral-600 transition-colors">
            Publicar Anuncio
          </Link>
          <Link href={ROUTES.ADS}>Anuncios</Link>
          <Link href={ROUTES.HOME}>Inicio</Link>
          {user ? (
            <>
              <Link href={ROUTES.PROFILE.ROOT}>Mi perfil</Link>
              {user.role.toUpperCase() === ROLES.ADMIN && <Link href={ROUTES.ADMIN.ROOT}>Admin</Link>}
            </>
          ) : (
            <Link href={ROUTES.AUTH.LOGIN} className="px-3 py-1 ">
              Acceder
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
