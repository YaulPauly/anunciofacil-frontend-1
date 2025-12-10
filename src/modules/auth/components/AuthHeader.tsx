import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes'

export default function AuthHeader() {
    return (
    <header className="w-full max-w-lg mx-auto mb-6">
      <Link href={ROUTES.HOME} className="text-2xl font-bold">AnuncioFácil</Link>
    </header>
  );
}