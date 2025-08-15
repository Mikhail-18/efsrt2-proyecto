import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTransactions } from '@/lib/actions';
import { CloseShiftAdminClientPage } from '@/components/admin/CloseShiftAdminClientPage';

export const dynamic = 'force-dynamic';

export default async function AdminCloseShiftPage() {
  const currentTransactions = await getTransactions();

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                 <Button variant="outline" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Panel
                    </Link>
                </Button>
                <h1 className="text-3xl font-headline font-semibold mt-4">Cierre de Caja</h1>
                <p className="text-muted-foreground">Resumen de todas las transacciones pagadas en el turno actual.</p>
            </div>
        </div>
        <CloseShiftAdminClientPage transactions={currentTransactions} />
    </div>
  );
}
