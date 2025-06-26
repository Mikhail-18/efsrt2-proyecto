'use server';

import { revalidatePath } from 'next/cache';
import { tables, type OrderItem, transactions } from './data';

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
        
        // Revalidate the waiter dashboard so they see the table is free.
        revalidatePath('/waiter');

        // DO NOT revalidate `/cashier` or `/cashier/table/[id]` here.
        // Doing so causes the page to re-render with the new "free" status,
        // which triggers a `notFound()` call and results in a 404 page
        // before the client can redirect. The cashier dashboard will update
        // when the user navigates back to it.

        return { success: true };
    }
    return { success: false, message: 'Table not found' };
}

export async function processPayment(tableId: number, paymentMethod: string) {
    const table = tables.find(t => t.id === tableId);
    if (table && table.order.length > 0) {
        const total = table.order.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        const receiptDetails = {
            order: [...table.order],
            total: total,
            tableName: table.name
        };

        transactions.push({
            id: `${Date.now()}-${tableId}`,
            tableId: table.id,
            tableName: table.name,
            order: [...table.order],
            total,
            paymentMethod,
            timestamp: new Date(),
        });

        await clearTable(tableId);

        revalidatePath('/cashier/close-shift');
        return { success: true, receipt: receiptDetails };
    }
    return { success: false, message: 'Table not found or order is empty' };
}

export async function clearTransactions() {
    transactions.length = 0;
    revalidatePath('/cashier/close-shift');
    return { success: true };
}
