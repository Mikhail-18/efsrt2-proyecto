import { AppHeader } from '@/components/AppHeader';
import { transactions } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, XCircle } from 'lucide-react';
import { clearTransactions } from '@/lib/actions';

export default function CloseShiftPage() {
  const totalSales = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const cashSales = transactions.filter(tx => tx.paymentMethod === 'Efectivo').reduce((sum, tx) => sum + tx.total, 0);
  const cardSales = transactions.filter(tx => tx.paymentMethod === 'Tarjeta').reduce((sum, tx) => sum + tx.total, 0);
  const mobileSales = transactions.filter(tx => tx.paymentMethod === 'Móvil').reduce((sum, tx) => sum + tx.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Cierre de Caja">
        <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar Reporte
            </Button>
            <form action={clearTransactions}>
                <Button variant="destructive" type="submit">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cerrar Turno
                </Button>
            </form>
        </div>
      </AppHeader>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Reporte de Turno</CardTitle>
                <CardDescription>Resumen de todas las transacciones pagadas en el turno actual.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Ventas Totales</CardTitle>
                    <CardDescription>Ingresos totales del turno</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-mono text-primary">S/{totalSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ventas en Efectivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">S/{cashSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ventas con Tarjeta</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">S/{cardSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pagos Móviles</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">S/{mobileSales.toFixed(2)}</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Detalle de Transacciones Pagadas</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mesa</TableHead>
                            <TableHead>Método de Pago</TableHead>
                            <TableHead className="text-right">Monto Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-medium">{tx.tableName}</TableCell>
                                <TableCell>{tx.paymentMethod}</TableCell>
                                <TableCell className="text-right font-mono">S/{tx.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>{transactions.length > 0 ? "Listado de todas las transacciones pagadas en el turno." : "No hay transacciones pagadas en este turno."}</TableCaption>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
