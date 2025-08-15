import { AppHeader } from '@/components/AppHeader';
import { TableCard } from '@/components/TableCard';
import { getTables } from '@/lib/actions';
import { AddTableCard } from '@/components/AddTableCard';

export const dynamic = 'force-dynamic';

export default async function WaiterDashboard() {
  const tables = await getTables();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Gestión de Mesas - Camarero" />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map(table => (
            <TableCard key={table.id} table={table} role="waiter" />
          ))}
          <AddTableCard />
        </div>
      </main>
    </div>
  );
}
