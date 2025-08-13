'use server';

import { revalidatePath } from 'next/cache';
import { tables, type OrderItem, transactions, menu, type MenuItem } from './data';

// Table Actions
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

export async function deleteTable(tableId: number) {
    const tableIndex = tables.findIndex(t => t.id === tableId);
    if (tableIndex > -1) {
        if (tables[tableIndex].status !== 'free') {
            return { success: false, message: 'No se puede eliminar una mesa ocupada o reservada.' };
        }
        tables.splice(tableIndex, 1);
        revalidatePath('/waiter');
        revalidatePath('/cashier');
        return { success: true };
    }
    return { success: false, message: 'Mesa no encontrada.' };
}


// Order Actions
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

// Payment Actions
export async function finalizePayment(tableId: number) {
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


// Admin Actions
export async function upsertMenuItem(data: Omit<MenuItem, 'id'> & { id?: string }) {
    if (data.id) {
        // Update existing item
        const index = menu.findIndex(item => item.id === data.id);
        if (index > -1) {
            menu[index] = { ...menu[index], ...data, id: data.id };
            revalidatePath('/admin/menu');
            return { success: true, menuItem: menu[index] };
        }
        return { success: false, message: 'Artículo no encontrado.' };
    } else {
        // Create new item
        const newMenuItem: MenuItem = {
            ...data,
            id: `${Date.now()}-${data.name.slice(0, 3)}`,
        };
        menu.push(newMenuItem);
        revalidatePath('/admin/menu');
        return { success: true, menuItem: newMenuItem };
    }
}

export async function deleteMenuItem(itemId: string) {
    const index = menu.findIndex(item => item.id === itemId);
    if (index > -1) {
        menu.splice(index, 1);
        revalidatePath('/admin/menu');
        return { success: true };
    }
    return { success: false, message: 'Artículo no encontrado.' };
}
