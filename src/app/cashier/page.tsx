import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { TableCard } from '@/components/TableCard';
import { getTables } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { DoorClosed } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CashierDashboard() {
  const tables = await getTables();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Gestión de Caja">
        <Button asChild variant="outline">
          <Link href="/cashier/close-shift">
            <DoorClosed className="mr-2 h-4 w-4" />
            Cierre de Caja
          </Link>
        </Button>
      </AppHeader>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
            <h2 className="text-2xl font-headline font-semibold">Mesas para Cobrar</h2>
            <p className="text-muted-foreground">Selecciona una mesa ocupada para procesar el pago.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map(table => (
            <TableCard key={table.id} table={table} role="cashier" />
          ))}
        </div>
      </main>
    </div>
  );
}
