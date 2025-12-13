import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export default function Homepage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Publica o Encuentra tu Próximo Anuncio
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        La plataforma más fácil para clasificados. Vende rápido, compra con confianza.
      </p>

      <div className="flex justify-center gap-4">
        <Link href={ROUTES.CREATE_AD}>
          <Button size="lg" variant="default">
            Publicar Anuncio Gratis
          </Button>
        </Link>
        
        <Link href={ROUTES.ADS}>
          <Button size="lg" variant="outline">
            Ver Todos los Anuncios
          </Button>
        </Link>
      </div>
      
      <div className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-4">¿Por qué AnuncioFácil?</h2>
        <div className="flex justify-center gap-8">
            <div className="w-1/3 p-4 border rounded-lg">
                <h3 className="font-semibold">Fácil de Usar</h3>
                <p className="text-sm text-gray-500">Publica en menos de 5 minutos.</p>
            </div>
             <div className="w-1/3 p-4 border rounded-lg">
                <h3 className="font-semibold">Gran Alcance</h3>
                <p className="text-sm text-gray-500">Llega a miles de compradores.</p>
            </div>
             <div className="w-1/3 p-4 border rounded-lg">
                <h3 className="font-semibold">Seguro</h3>
                <p className="text-sm text-gray-500">Comunicaciones privadas y seguras.</p>
            </div>
        </div>
      </div>
    </div>
  );
}