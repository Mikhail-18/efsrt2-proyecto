"use client";

import type { FC } from 'react';
import React, { useState, useMemo, useTransition } from 'react';
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
import { Banknote, CreditCard, Smartphone, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { processPayment, finalizePayment } from '@/lib/actions';

interface PaymentProcessorProps {
  table: Table;
}

interface ReceiptData {
    order: OrderItem[];
    total: number;
    tableName: string;
}

const BillDetails: FC<{order: OrderItem[]}> = ({ order }) => (
    <ul className="space-y-2">
      {order.map(item => (
        <li key={item.id} className="flex justify-between items-baseline">
          <span>{item.name} <span className="text-sm text-muted-foreground">x{item.quantity}</span></span>
          <span className="font-mono">S/{(item.price * item.quantity).toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );

export function PaymentProcessor({ table }: PaymentProcessorProps) {
  const [splitType, setSplitType] = useState('none');
  const [splitCount, setSplitCount] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isFinalizing, startFinalizing] = useTransition();

  const total = useMemo(() => table.order.reduce((sum, item) => sum + item.price * item.quantity, 0), [table.order]);
  
  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Selección Requerida",
        description: "Por favor, selecciona un método de pago.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processPayment(table.id, paymentMethod);
      
      if (result.success && result.receipt) {
        setReceiptData(result.receipt);
        toast({
          title: "Pago Exitoso",
          description: `Se ha registrado el pago de ${result.receipt.tableName} con ${paymentMethod}.`,
          variant: "default",
        });
      } else {
        throw new Error(result.message || 'No se pudo procesar el pago.');
      }
    } catch (error) {
       toast({
        title: "Error de Pago",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && receiptData) {
      startFinalizing(async () => {
        await finalizePayment(table.id);
        setReceiptData(null);
        router.push('/cashier');
      });
    }
  }

  const getSplitAmount = () => {
    if (splitType === 'equally' && splitCount > 0) {
      return total / splitCount;
    }
    return total;
  };

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
                <span className="font-mono">S/{total.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Procesar Pago</CardTitle>
            <CardDescription>Dividir cuenta y seleccionar método de pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow">
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
              <p className="font-bold text-3xl font-mono text-primary">S/{getSplitAmount().toFixed(2)}</p>
            </div>
            <Separator />
            <div>
              <Label className="font-semibold mb-4 block">Método de Pago</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                 <div>
                    <RadioGroupItem value="Efectivo" id="p-efectivo" className="peer sr-only" />
                    <Label htmlFor="p-efectivo" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <Banknote className="mb-3 h-6 w-6" />
                      Efectivo
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="Tarjeta" id="p-tarjeta" className="peer sr-only" />
                    <Label htmlFor="p-tarjeta" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <CreditCard className="mb-3 h-6 w-6" />
                      Tarjeta
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="Yape" id="p-yape" className="peer sr-only" />
                    <Label htmlFor="p-yape" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <Smartphone className="mb-3 h-6 w-6" />
                      Yape
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="Plin" id="p-plin" className="peer sr-only" />
                    <Label htmlFor="p-plin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <Smartphone className="mb-3 h-6 w-6" />
                      Plin
                    </Label>
                  </div>
              </RadioGroup>
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={handlePayment} disabled={!paymentMethod || isProcessing} className="w-full" size="lg">
              {isProcessing ? 'Procesando...' : (
                  <>
                      <Send className="mr-2 h-4 w-4" />
                      Pagar
                  </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={!!receiptData} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Recibo de {receiptData?.tableName}</DialogTitle>
            <DialogDescription>
              Gracias por su visita a RestoFlow. La mesa será liberada al cerrar este diálogo.
            </DialogDescription>
          </DialogHeader>
          {receiptData && (
            <div className="my-4">
              <ScrollArea className="h-64 border rounded-md p-4">
                <BillDetails order={receiptData.order} />
              </ScrollArea>
              <Separator className="my-2" />
              <div className="flex justify-between items-center w-full font-bold text-lg">
                  <span>Total:</span>
                  <span className="font-mono">S/{receiptData.total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Pagado. ¡Vuelva pronto!</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isFinalizing}>
                {isFinalizing ? "Cerrando..." : "Cerrar"}
              </Button>
            </DialogClose>
            <Button type="button" onClick={() => window.print()}>Imprimir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
