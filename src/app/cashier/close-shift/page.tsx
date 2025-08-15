import { CloseShiftClientPage } from '@/components/cashier/CloseShiftClientPage';
import { getTransactions } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function CloseShiftPage() {
  const currentTransactions = await getTransactions();

  return (
    <div className="min-h-screen bg-background">
      <CloseShiftClientPage transactions={currentTransactions} />
    </div>
  );
}
