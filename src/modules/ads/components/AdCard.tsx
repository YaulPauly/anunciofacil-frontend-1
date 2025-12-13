import Link from 'next/link';
import { MapPin } from 'lucide-react';

// Importaciones basadas en archivos provistos
import { Ads } from '@/types/ads.types'; //
import { ROUTES } from '@/shared/constants/routes'; //
import { cn } from '@/shared/utils'; //

interface AdCardProps {
  ad: Ads;
  className?: string;
}

export function AdCard({ ad, className }: AdCardProps) {
  const adUrl = ROUTES.AD_DETAIL(ad.id.toString()); //
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  }

  return (
    <Link 
      href={adUrl}
      className={cn("block bg-white border rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group", className)}
    >
      <div className="relative h-48 w-full">
        <img 
          src={ad.imagenUrl} 
          alt={ad.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />

        <span className="absolute top-2 right-2 bg-ads text-text text-xs font-semibold px-2 py-0.5 rounded-full">
            {ad.category.charAt(0).toUpperCase() + ad.category.slice(1)}
        </span>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
            {ad.title}
        </h2>
        <div className="flex items-center text-sm text-gray-500 mt-2">
            <MapPin className="size-4 mr-1" />
            <span>{ad.location}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
            Publicado el {formatDate(ad.createdAt)}
        </p>
      </div>
    </Link>
  );
}