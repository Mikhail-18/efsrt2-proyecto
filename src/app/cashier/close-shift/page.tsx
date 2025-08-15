import { CloseShiftClientPage } from '@/components/cashier/CloseShiftClientPage';
import { transactions } from '@/lib/data';
import { AppHeader } from '@/components/AppHeader';

export const dynamic = 'force-dynamic';

export default function CloseShiftPage() {
  const currentTransactions = transactions;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Cierre de Caja" showBackButton={true} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <CloseShiftClientPage transactions={currentTransactions} />
      </main>
    </div>
  );
}
