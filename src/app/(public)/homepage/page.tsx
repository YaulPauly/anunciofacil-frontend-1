import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { AdGrid } from "@/modules/ads/components/AdGrid";
import { getAds } from "@/modules/ads/services/ad.service";


export default async function Homepage() {
 const initialAds = await getAds(1, 9);

  return (
    <main className="w-full">
      <section className="hero">
        <div className="text-center py-40 px-4">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Publica o Encuentra tu Próximo Anuncio
          </h1>

          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            La plataforma más fácil para clasificados. Vende rápido, compra con confianza.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={ROUTES.CREATE_AD}>
              <Button size="lg">
                Publicar Anuncio Gratis
              </Button>
            </Link>

            <Link href={ROUTES.ADS}>
              <Button size="lg" variant="outline">
                Ver Todos los Anuncios
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            ¿Por qué AnuncioFácil?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Fácil de Usar</h3>
              <p className="text-sm text-gray-500">
                Publica en menos de 5 minutos.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Gran Alcance</h3>
              <p className="text-sm text-gray-500">
                Llega a miles de compradores.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Seguro</h3>
              <p className="text-sm text-gray-500">
                Comunicaciones privadas y seguras.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="recent-ads" className="py-20 px-4 bg-gray-50">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Anuncios Recientes
          </h2>
        </div>
        <AdGrid initialAds={initialAds} />
      </section>

    </main>
  );
}
