"use client";

import type { FC } from 'react';
import React, { useState, useMemo } from 'react';
import type { Table, OrderItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Banknote, CreditCard, Smartphone } from 'lucide-react';

interface PaymentProcessorProps {
  table: Table;
}

export function PaymentProcessor({ table }: PaymentProcessorProps) {
  const [splitType, setSplitType] = useState('none');
  const [splitCount, setSplitCount] = useState(2);
  const [isPaid, setIsPaid] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const { toast } = useToast();

  const total = useMemo(() => table.order.reduce((sum, item) => sum + item.price * item.quantity, 0), [table.order]);
  
  const handlePayment = (method: string) => {
    console.log(`Payment of $${total.toFixed(2)} for ${table.name} via ${method}`);
    setIsPaid(true);
    toast({
      title: "Pago Exitoso",
      description: `Se ha registrado el pago de ${table.name} con ${method}.`,
      variant: "default",
    });
  };

  const getSplitAmount = () => {
    if (splitType === 'equally' && splitCount > 0) {
      return total / splitCount;
    }
    return total;
  };

  const BillDetails: FC<{order: OrderItem[]}> = ({ order }) => (
    <ul className="space-y-2">
      {order.map(item => (
        <li key={item.id} className="flex justify-between items-baseline">
          <span>{item.name} <span className="text-sm text-muted-foreground">x{item.quantity}</span></span>
          <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Cuenta de {table.name}</CardTitle>
            <CardDescription>Resumen del pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <BillDetails order={table.order} />
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full font-bold text-xl">
                <span>Total:</span>
                <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Procesar Pago</CardTitle>
            <CardDescription>Dividir cuenta y seleccionar método de pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-semibold">Dividir Cuenta</Label>
              <RadioGroup value={splitType} onValueChange={setSplitType} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="r1" />
                  <Label htmlFor="r1">No dividir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equally" id="r2" />
                  <Label htmlFor="r2">Dividir en partes iguales</Label>
                </div>
              </RadioGroup>
              {splitType === 'equally' && (
                <div className="mt-4 pl-6">
                  <Label htmlFor="split-count">Número de personas</Label>
                  <Input 
                    id="split-count" 
                    type="number" 
                    value={splitCount} 
                    onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))} 
                    className="w-24 mt-1"
                  />
                </div>
              )}
            </div>
            <Separator />
            <div className="text-center">
              <p className="text-muted-foreground">Total a pagar {splitType === 'equally' ? 'por persona' : ''}</p>
              <p className="font-bold text-3xl font-mono text-primary">${getSplitAmount().toFixed(2)}</p>
            </div>
            <Separator />
            <div>
              <Label className="font-semibold mb-2 block">Método de Pago</Label>
              {isPaid ? (
                 <div className="text-center p-4 bg-green-100 rounded-md">
                   <p className="font-semibold text-green-800">Cuenta Pagada</p>
                 </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="lg" onClick={() => handlePayment('Efectivo')}><Banknote className="mr-2 h-5 w-5"/>Efectivo</Button>
                  <Button variant="outline" size="lg" onClick={() => handlePayment('Tarjeta')}><CreditCard className="mr-2 h-5 w-5"/>Tarjeta</Button>
                  <Button variant="outline" size="lg" onClick={() => handlePayment('Móvil')}><Smartphone className="mr-2 h-5 w-5"/>Móvil</Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!isPaid} onClick={() => setShowReceipt(true)}>
              Generar Recibo
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Recibo de {table.name}</DialogTitle>
            <DialogDescription>
              Gracias por su visita a RestoFlow.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <ScrollArea className="h-64 border rounded-md p-4">
              <BillDetails order={table.order} />
            </ScrollArea>
             <Separator className="my-2" />
            <div className="flex justify-between items-center w-full font-bold text-lg">
                <span>Total:</span>
                <span className="font-mono">${total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Pagado. ¡Vuelva pronto!</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cerrar</Button>
            </DialogClose>
            <Button type="button" onClick={() => window.print()}>Imprimir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
