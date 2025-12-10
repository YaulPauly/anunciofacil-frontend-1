import React, { use } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { ROLES } from '@/shared/constants/roles'

export const Navbar = () => {
  const user = useAuthStore((s) => s.user)

  return(
    <header className='bg-white border-b'>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={ROUTES.HOME} className="text-xl font-semibold">
          AnuncioFácil
        </Link>

        <nav className="flex items-center gap-4">
          <Link href={ROUTES.ADS}>Anuncios</Link>
          <Link href={ROUTES.CATEGORY("empleos")}>Empleos</Link>
          <Link href={ROUTES.CATEGORY("bienes")}>Bienes</Link>
          <Link href={ROUTES.CATEGORY("inmuebles")}>Inmuebles</Link>
          <Link href={ROUTES.CATEGORY("autos")}>Autos</Link>

          {user ? (
            <>
              <Link href={ROUTES.PROFILE}>Mi perfil</Link>
              {user.role === ROLES.ADMIN && <Link href={ROUTES.ADMIN.ROOT}>Admin</Link>}
            </>
          ) : (
            <Link href={ROUTES.AUTH.LOGIN} className="px-3 py-1 border rounded">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
