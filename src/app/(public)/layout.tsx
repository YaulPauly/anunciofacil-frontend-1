import type { ReactNode } from 'react';
import Footer from '@/shared/components/Footer';
import { Navbar } from '@/shared/components/Navbar';

export const metadata = {
    title: "AnuncioFacil",
    description: "Plataforma para publicar y buscar anuncios clasificados de manera fácil y rápida.",
}

export default function PublicLayout({children}: {children: ReactNode}){
    return (
        <html lang="es">
            <body className='bg-white text-slate-900 antialiased'>
                <div className='min-h-screen flex flex-col'>
                    <Navbar />
                    <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    )
}