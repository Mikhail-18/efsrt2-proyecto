import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SalesReport } from '@/components/admin/SalesReport';
import { getTransactions } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const salesData = await getTransactions();

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
            <h1 className="text-3xl font-headline font-semibold mt-4">Reportes de Ventas</h1>
            <p className="text-muted-foreground">Analiza el rendimiento y las ventas de tu restaurante.</p>
          </div>
      </div>
      <SalesReport transactions={salesData} />
    </div>
  );
}
