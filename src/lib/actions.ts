'use server';

import { revalidatePath } from 'next/cache';
import { tables, type OrderItem } from './data';

export async function updateOrder(tableId: number, newOrder: OrderItem[]) {
  const table = tables.find(t => t.id === tableId);

  if (table) {
    table.order = newOrder;
    if (newOrder.length > 0) {
      table.status = 'occupied';
    } else {
      table.status = 'free';
    }
    
    // Revalidate paths to reflect changes
    revalidatePath('/waiter');
    revalidatePath(`/waiter/table/${tableId}`);
    revalidatePath('/cashier');
    revalidatePath(`/cashier/table/${tableId}`);
    
    return { success: true, table };
  }
  
  return { success: false, message: 'Table not found' };
}

export async function clearTable(tableId: number) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.order = [];
        table.status = 'free';
        
        revalidatePath('/waiter');
        revalidatePath('/cashier');
        revalidatePath(`/cashier/table/${tableId}`);

        return { success: true };
    }
    return { success: false, message: 'Table not found' };
}
