import Link from 'next/link';
import { transactions } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, XCircle, ArrowLeft } from 'lucide-react';
import { clearTransactions } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default function AdminCloseShiftPage() {
  const totalSales = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const cashSales = transactions.filter(tx => tx.paymentMethod === 'Efectivo').reduce((sum, tx) => sum + tx.total, 0);
  const cardSales = transactions.filter(tx => tx.paymentMethod === 'Tarjeta').reduce((sum, tx) => sum + tx.total, 0);
  const yapeSales = transactions.filter(tx => tx.paymentMethod === 'Yape').reduce((sum, tx) => sum + tx.total, 0);
  const plinSales = transactions.filter(tx => tx.paymentMethod === 'Plin').reduce((sum, tx) => sum + tx.total, 0);

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
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
                    <CardTitle>Ventas con Yape</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">S/{yapeSales.toFixed(2)}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Ventas con Plin</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">S/{plinSales.toFixed(2)}</p>
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
    </div>
  );
}
