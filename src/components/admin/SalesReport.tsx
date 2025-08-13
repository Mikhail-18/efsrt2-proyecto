"use client"

import type { Transaction } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SalesReportProps {
  transactions: Transaction[];
}

export function SalesReport({ transactions }: SalesReportProps) {
  const { totalSales, totalTransactions, averageTicket, salesByDay, bestSellers } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalSales: 0,
        totalTransactions: 0,
        averageTicket: 0,
        salesByDay: [],
        bestSellers: [],
      };
    }

    const totalSales = transactions.reduce((sum, tx) => sum + tx.total, 0);
    const totalTransactions = transactions.length;
    const averageTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    const salesByDay = transactions.reduce((acc, tx) => {
      const day = format(new Date(tx.timestamp), 'eeee, dd MMM', { locale: es });
      if (!acc[day]) {
        acc[day] = { name: day, total: 0 };
      }
      acc[day].total += tx.total;
      return acc;
    }, {} as Record<string, { name: string; total: number }>);

    const bestSellers = transactions
      .flatMap(tx => tx.order)
      .reduce((acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = { name: item.name, quantity: 0 };
        }
        acc[item.id].quantity += item.quantity;
        return acc;
      }, {} as Record<string, { name: string; quantity: number }>)

    return {
      totalSales,
      totalTransactions,
      averageTicket,
      salesByDay: Object.values(salesByDay).map(d => ({...d, total: parseFloat(d.total.toFixed(2))})),
      bestSellers: Object.values(bestSellers).sort((a, b) => b.quantity - a.quantity).slice(0, 10),
    };
  }, [transactions]);
  
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay datos de ventas</CardTitle>
          <CardDescription>Aún no se han registrado transacciones en este turno.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">
            Realiza algunas ventas para ver los reportes aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ventas Totales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-mono text-primary">S/{totalSales.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Transacciones Totales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-mono">{totalTransactions}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ticket Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-mono">S/{averageTicket.toFixed(2)}</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ventas por Día</CardTitle>
                    <CardDescription>Visualización de los ingresos diarios.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesByDay} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => `S/${value}`} />
                                <ChartTooltip
                                    content={<ChartTooltipContent
                                        formatter={(value) => `S/${(value as number).toFixed(2)}`}
                                        labelClassName="font-bold"
                                        nameKey="name"
                                    />}
                                />
                                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Ventas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Platos Más Vendidos</CardTitle>
                    <CardDescription>Los 10 productos más populares.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plato</TableHead>
                                <TableHead className="text-right">Cantidad Vendida</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bestSellers.map(item => (
                                <TableRow key={item.name}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
