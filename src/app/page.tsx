import { LoginForm } from '@/components/LoginForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-headline font-bold text-primary">RestoFlow</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Optimiza la atención al cliente en tu restaurante.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
