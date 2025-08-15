import { AppHeader } from '@/components/AppHeader';
import { OrderTaker } from '@/components/waiter/OrderTaker';
import { getTableById, getMenu } from '@/lib/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WaiterTablePage({ params }: { params: { id: string } }) {
  const table = await getTableById(params.id);

  if (!table) {
    notFound();
  }

  const menuItems = await getMenu();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={`Pedido para ${table.name}`} showBackButton={true} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <OrderTaker table={table} menuItems={menuItems} />
      </main>
    </div>
  );
}
