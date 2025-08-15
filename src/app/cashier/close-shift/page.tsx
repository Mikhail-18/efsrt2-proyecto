import { CloseShiftClientPage } from '@/components/cashier/CloseShiftClientPage';
import { transactions } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function CloseShiftPage() {
  const currentTransactions = transactions;

  return (
    <div className="min-h-screen bg-background">
      <CloseShiftClientPage transactions={currentTransactions} />
    </div>
  );
}
