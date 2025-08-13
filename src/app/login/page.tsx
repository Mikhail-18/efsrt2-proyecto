import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-headline font-bold text-primary">RestoFlow</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Acceso para Empleados
        </p>
      </div>
      <LoginForm />
       <div className='text-center mt-4'>
        <p className='text-sm text-muted-foreground'>
            ¿Eres el dueño? <Link href="/" className='underline'>Ingresa al panel de administración</Link>
        </p>
      </div>
    </main>
  );
}
