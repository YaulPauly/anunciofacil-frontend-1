import type { ReactNode } from 'react';
import Footer from '@/shared/components/Footer';
import { Navbar } from '@/shared/components/Navbar';

export const metadata = {
    title: "AnuncioFacil",
    description: "Plataforma para publicar y buscar anuncios clasificados de manera fácil y rápida.",
}

export default function PublicLayout({children}: {children: ReactNode}){
    return (
        
        <div className='min-h-screen flex flex-col'>
                <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
        </div>
            
    )
}