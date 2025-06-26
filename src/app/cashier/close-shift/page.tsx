import { AppHeader } from '@/components/AppHeader';
import { tables, type OrderItem } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const calculateTotal = (order: OrderItem[]) => {
    return order.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default function CloseShiftPage() {
  const paidTables = tables.filter(t => t.status === 'occupied' && t.order.length > 0);
  const totalSales = paidTables.reduce((sum, table) => sum + calculateTotal(table.order), 0);
  // Mocking payment method distribution
  const cashSales = totalSales * 0.4;
  const cardSales = totalSales * 0.5;
  const mobileSales = totalSales * 0.1;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Cierre de Caja">
        <Button variant="default">
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      </AppHeader>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Reporte de Turno</CardTitle>
                <CardDescription>Resumen de las transacciones del turno actual.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Ventas Totales</CardTitle>
                    <CardDescription>Ingresos totales del turno</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-mono text-primary">${totalSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ventas en Efectivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">${cashSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ventas con Tarjeta</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">${cardSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pagos Móviles</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold font-mono">${mobileSales.toFixed(2)}</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Detalle de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mesa</TableHead>
                            <TableHead>Nº de Artículos</TableHead>
                            <TableHead className="text-right">Monto Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paidTables.map(table => (
                            <TableRow key={table.id}>
                                <TableCell className="font-medium">{table.name}</TableCell>
                                <TableCell>{table.order.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                                <TableCell className="text-right font-mono">${calculateTotal(table.order).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>{paidTables.length > 0 ? "Listado de todas las mesas cobradas en el turno." : "No hay transacciones en este turno."}</TableCaption>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
