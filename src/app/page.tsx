import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed, Landmark } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-headline font-bold text-primary">RestoFlow</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Optimiza la atención al cliente en tu restaurante.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/waiter" className="transform hover:scale-105 transition-transform duration-300">
          <Card className="h-full w-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-col items-center justify-center p-8 text-center">
              <UtensilsCrossed className="w-16 h-16 mb-4 text-primary" />
              <CardTitle className="text-3xl font-headline">Soy Camarero</CardTitle>
              <CardDescription className="mt-2 text-base">Gestionar mesas y tomar pedidos.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/cashier" className="transform hover:scale-105 transition-transform duration-300">
          <Card className="h-full w-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-col items-center justify-center p-8 text-center">
              <Landmark className="w-16 h-16 mb-4 text-primary" />
              <CardTitle className="text-3xl font-headline">Soy Cajero</CardTitle>
              <CardDescription className="mt-2 text-base">Procesar pagos y cerrar caja.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
