import { AppHeader } from '@/components/AppHeader';
import { PaymentProcessor } from '@/components/cashier/PaymentProcessor';
import { getTableById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function CashierTablePage({ params }: { params: { id: string } }) {
  const tableId = parseInt(params.id, 10);
  const table = getTableById(tableId);

  if (!table || table.status !== 'occupied') {
    // Only allow payment for occupied tables
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={`Cobrar ${table.name}`} showBackButton={true} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PaymentProcessor table={table} />
      </main>
    </div>
  );
}
