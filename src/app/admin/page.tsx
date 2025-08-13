import { AppHeader } from '@/components/AppHeader';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Panel de Administrador" />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-headline font-semibold">Bienvenido, Admin</h2>
        <p className="text-muted-foreground">Aquí podrás gestionar tu restaurante.</p>
      </main>
    </div>
  );
}
