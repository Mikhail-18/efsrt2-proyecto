'use server';

import { revalidatePath } from 'next/cache';
import { tables, type OrderItem, transactions } from './data';

export async function addTable() {
    const newTableId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
    const newTable = {
        id: newTableId,
        name: `Mesa ${newTableId}`,
        status: 'free' as const,
        order: [],
    };
    tables.push(newTable);
    revalidatePath('/waiter');
    return { success: true, newTable };
}

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

export async function finalizePayment(tableId: number) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.order = [];
        table.status = 'free';
        
        revalidatePath('/waiter');
        revalidatePath('/cashier');
        
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

        // The table is NOT cleared here. This is handled by finalizePayment.
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
