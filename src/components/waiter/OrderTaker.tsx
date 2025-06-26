
"use client";

import type { FC } from 'react';
import React, { useState } from 'react';
import type { Table, MenuItem, OrderItem } from '@/lib/data';
import { menu } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, Trash2, Utensils, Beer, Cookie, Soup } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateOrder } from '@/lib/actions';

interface OrderTakerProps {
  table: Table;
}

const categoryIcons: Record<MenuItem['category'], React.ReactNode> = {
  'Entradas': <Soup className="w-5 h-5 mr-2" />,
  'Platos Principales': <Utensils className="w-5 h-5 mr-2" />,
  'Postres': <Cookie className="w-5 h-5 mr-2" />,
  'Bebidas': <Beer className="w-5 h-5 mr-2" />,
};

const MenuItemCard: FC<{ item: MenuItem; onAddToOrder: (item: MenuItem) => void }> = ({ item, onAddToOrder }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={() => onAddToOrder(item)}>
        <PlusCircle className="h-6 w-6 text-primary" />
      </Button>
    </CardContent>
  </Card>
);

const OrderSummary: FC<{ 
  table: Table;
  order: OrderItem[]; 
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSubmitOrder: () => void;
  isSubmitting: boolean;
}> = ({ table, order, onUpdateQuantity, onRemoveItem, onSubmitOrder, isSubmitting }) => {
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
                <li key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </ScrollArea>
      {(order.length > 0 || table.order.length > 0) && ( // Show footer if there is a new order or an existing one
        <CardFooter className="flex-col items-stretch mt-auto p-4 border-t">
          <Textarea placeholder="Añadir peticiones especiales..." className="mb-4" />
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-bold text-lg mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button onClick={onSubmitOrder} size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar Pedido'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};


export function OrderTaker({ table }: OrderTakerProps) {
  const [order, setOrder] = useState<OrderItem[]>(table.order);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToOrder = (itemToAdd: MenuItem) => {
    setOrder(prevOrder => {
      const existingItem = prevOrder.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        return prevOrder.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevOrder, { ...itemToAdd, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setOrder(prevOrder =>
        prevOrder.map(item => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setOrder(prevOrder => prevOrder.filter(item => item.id !== itemId));
  };
  
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      await updateOrder(table.id, order);
      toast({
        title: "Pedido Actualizado",
        description: `El pedido para ${table.name} ha sido actualizado.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el pedido.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuCategories = Array.from(new Set(menu.map(item => item.category)));

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
                  {menu.filter(item => item.category === category).map(item => (
                    <MenuItemCard key={item.id} item={item} onAddToOrder={handleAddToOrder} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="lg:col-span-1 h-full">
        <OrderSummary 
          table={table}
          order={order}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onSubmitOrder={handleSubmitOrder}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
