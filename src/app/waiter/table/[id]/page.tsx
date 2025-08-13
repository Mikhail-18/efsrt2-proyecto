import { AppHeader } from '@/components/AppHeader';
import { OrderTaker } from '@/components/waiter/OrderTaker';
import { getTableById, menu } from '@/lib/data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function WaiterTablePage({ params }: { params: { id: string } }) {
  const tableId = parseInt(params.id, 10);
  const table = getTableById(tableId);

  if (!table) {
    notFound();
  }

  const menuItems = menu;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={`Pedido para ${table.name}`} showBackButton={true} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <OrderTaker table={table} menuItems={menuItems} />
      </main>
    </div>
  );
}
