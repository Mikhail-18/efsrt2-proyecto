import { AppHeader } from '@/components/AppHeader';
import { PaymentProcessor } from '@/components/cashier/PaymentProcessor';
import { getTableById } from '@/lib/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CashierTablePage({ params }: { params: { id: string } }) {
  const table = await getTableById(params.id);

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
