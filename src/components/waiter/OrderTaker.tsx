"use client";

import type { FC } from 'react';
import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Table, MenuItem, OrderItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, Trash2, Utensils, Beer, Cookie, Soup, Send } from 'lucide-react';
import { updateOrder } from '@/lib/actions';
import { Input } from '@/components/ui/input';

interface OrderTakerProps {
  table: Table;
  menuItems: MenuItem[];
}

const categoryIcons: Record<MenuItem['category'], React.ReactNode> = {
  'Entradas': <Soup className="w-5 h-5 mr-2" />,
  'Platos Principales': <Utensils className="w-5 h-5 mr-2" />,
  'Postres': <Cookie className="w-5 h-5 mr-2" />,
  'Bebidas': <Beer className="w-5 h-5 mr-2" />,
};

const MenuItemCard: FC<{ item: MenuItem; onAddToOrder: (item: MenuItem) => void; disabled: boolean }> = ({ item, onAddToOrder, disabled }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-muted-foreground">S/{item.price.toFixed(2)}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={() => onAddToOrder(item)} disabled={disabled}>
        <PlusCircle className="h-6 w-6 text-primary" />
      </Button>
    </CardContent>
  </Card>
);

const OrderSummary: FC<{ 
  order: OrderItem[]; 
  onUpdateItem: (itemId: string, quantity: number, notes?: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}> = ({ order, onUpdateItem, isSubmitting, onSubmit }) => {
  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Pedido Actual</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent>
          {order.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">El pedido está vacío.</p>
          ) : (
            <ul className="space-y-4">
              {order.map(item => (
                <li key={item.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">S/{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onUpdateItem(item.id, item.quantity - 1, item.notes)} disabled={isSubmitting}>
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => onUpdateItem(item.id, item.quantity + 1, item.notes)} disabled={isSubmitting}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onUpdateItem(item.id, 0)} disabled={isSubmitting}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <Input 
                    placeholder="Añadir notas (ej. sin picante)..."
                    defaultValue={item.notes}
                    className="mt-2 h-8"
                    onBlur={(e) => onUpdateItem(item.id, item.quantity, e.target.value)}
                    disabled={isSubmitting}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </ScrollArea>
      {order.length > 0 && (
        <CardFooter className="flex-col items-stretch mt-auto p-4 border-t">
          <Separator className="my-2" />
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>S/{total.toFixed(2)}</span>
          </div>
          <Button onClick={onSubmit} disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? 'Enviando...' : (
                <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Pedido a Cocina
                </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};


export function OrderTaker({ table, menuItems }: OrderTakerProps) {
  const [order, setOrder] = useState<OrderItem[]>(table.order);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdateServerOrder = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (newOrder: OrderItem[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await updateOrder(table.id, newOrder);
        } catch (error) {
          toast({
            title: "Error de Sincronización",
            description: "No se pudieron guardar los últimos cambios en el servidor.",
            variant: "destructive",
          });
          // Potentially revert local state to `table.order` here if strict consistency is needed
        }
      }, 500); // Debounce requests
    };
  }, [table.id, toast]);


  const handleUpdateItem = (itemId: string, quantity: number, notes?: string) => {
    const newOrder = [...order];
    const itemIndex = newOrder.findIndex(item => item.id === itemId);

    if (itemIndex === -1) return; // Should not happen

    if (quantity <= 0) {
      // Remove item
      newOrder.splice(itemIndex, 1);
    } else {
      // Update quantity or notes
      newOrder[itemIndex] = { ...newOrder[itemIndex], quantity, notes: notes ?? newOrder[itemIndex].notes };
    }
    
    setOrder(newOrder);
    handleUpdateServerOrder(newOrder);
  };
  
  const handleAddToOrder = (itemToAdd: MenuItem) => {
    const newOrder = [...order];
    const existingItemIndex = newOrder.findIndex(item => item.id === itemToAdd.id);

    if (existingItemIndex > -1) {
      newOrder[existingItemIndex].quantity += 1;
    } else {
      newOrder.push({ ...itemToAdd, quantity: 1, notes: '' });
    }
    setOrder(newOrder);
    handleUpdateServerOrder(newOrder);
  };

  const handleSendToKitchen = () => {
    startTransition(async () => {
        try {
            await updateOrder(table.id, order); // Final sync before leaving
            toast({
                title: "Pedido Enviado",
                description: `El pedido de la ${table.name} ha sido enviado a la cocina.`,
            });
            router.push('/waiter');
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo enviar el pedido.",
                variant: "destructive",
            });
        }
    });
  }

  const menuCategories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-4rem-1px)]">
      <div className="lg:col-span-2 h-full">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-8">
            {menuCategories.map(category => (
              <section key={category}>
                <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center">
                  {categoryIcons[category]}
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {menuItems.filter(item => item.category === category).map(item => (
                    <MenuItemCard key={item.id} item={item} onAddToOrder={handleAddToOrder} disabled={isPending} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="lg:col-span-1 h-full">
        <OrderSummary 
          order={order}
          onUpdateItem={handleUpdateItem}
          isSubmitting={isPending}
          onSubmit={handleSendToKitchen}
        />
      </div>
    </div>
  );
}
