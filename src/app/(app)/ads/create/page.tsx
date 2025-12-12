import { AdForm } from '@/modules/ads/components/AdForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Publicar nuevo anuncio",
};

export default function CreateAdPage() {
    return (
        <div className='max-w-3xl mx-auto py-8'>
            <h1 className='text-3xl font-bold mb-6'>Publicar nuevo anuncio</h1>
            <p className="text-gray-600 mb-6">Completa los siguientes campos para que tu anuncio esté visible en la plataforma. Tu anuncio será revisado antes de ser aprobado.</p>
      
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <AdForm />
            </div>
        </div>
    )
}