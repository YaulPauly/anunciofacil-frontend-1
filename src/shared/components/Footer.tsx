import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";

export default function Footer() {
  return (
    <footer className="bg-navbar border-t mt-8">
      <div className="container mx-auto p-4 flex justify-between items-center text-sm text-slate-600">
        <div>© {new Date().getFullYear()} AnuncioFácil.</div>

        <div className="flex gap-4">
          <Link href={ROUTES.HOME}>Inicio</Link>
          <Link href={ROUTES.ADS}>Anuncios</Link>
          <Link href={ROUTES.AUTH.LOGIN}>Entrar</Link>
        </div>
      </div>
    </footer>
  );
}