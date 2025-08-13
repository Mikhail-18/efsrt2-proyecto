import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-headline font-bold text-primary">RestoFlow</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Optimiza la atención al cliente en tu restaurante.
        </p>
      </div>
       <Button asChild size="lg">
        <Link href="/admin">
            <Shield className="mr-2 h-5 w-5" />
            Ingresar como Administrador
        </Link>
      </Button>
      <div className='text-center mt-4'>
        <p className='text-sm text-muted-foreground'>
            ¿No eres el dueño? <Link href="/login" className='underline'>Ingresa como empleado</Link>
        </p>
      </div>
    </main>
  );
}
