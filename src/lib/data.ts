export type TableStatus = 'free' | 'occupied' | 'reserved';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Entradas' | 'Platos Principales' | 'Postres' | 'Bebidas';
}

export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Table {
  id: string; // Changed to string for Firestore document ID
  name: string;
  status: TableStatus;
  order: OrderItem[];
  waiterName?: string;
}

export interface Transaction {
  id: string; // Firestore document ID
  tableId: string;
  tableName: string;
  order: OrderItem[];
  total: number;
  paymentMethod: string;
  timestamp: Date; // Firestore handles Timestamps, but Date is fine for client
}

export type EmployeeRole = 'waiter' | 'cashier';

export interface Employee {
    id: string; // Firestore document ID
    name: string;
    role: EmployeeRole;
    pin: string;
}

// All data is now fetched from Firestore.
// The initial data has been removed from this file.
// The functions to interact with data are in actions.ts and use Firestore.
