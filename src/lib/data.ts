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
  id: number;
  name: string;
  status: TableStatus;
  order: OrderItem[];
  waiterName?: string;
}

export interface Transaction {
  id: string;
  tableId: number;
  tableName: string;
  order: OrderItem[];
  total: number;
  paymentMethod: string;
  timestamp: Date;
}

export type EmployeeRole = 'waiter' | 'cashier';

export interface Employee {
    id: string;
    name: string;
    role: EmployeeRole;
    pin: string;
}


// This is a workaround to simulate a database in a development/serverless environment
// where module-level variables can be re-initialized on each request/hot-reload.
declare global {
  var tables: Table[] | undefined;
  var transactions: Transaction[] | undefined;
  var menu: MenuItem[] | undefined;
  var employees: Employee[] | undefined;
}

const initialMenu: MenuItem[] = [
  // Entradas
  { id: '1', name: 'Ceviche Clásico', price: 18.00, category: 'Entradas' },
  { id: '2', name: 'Causa Limeña', price: 14.00, category: 'Entradas' },
  { id: '3', name: 'Papa a la Huancaína', price: 12.00, category: 'Entradas' },
  // Platos Principales
  { id: '4', name: 'Lomo Saltado', price: 22.00, category: 'Platos Principales' },
  { id: '5', name: 'Ají de Gallina', price: 19.50, category: 'Platos Principales' },
  { id: '6', name: 'Arroz con Pollo', price: 17.00, category: 'Platos Principales' },
  // Postres
  { id: '7', name: 'Suspiro a la Limeña', price: 9.00, category: 'Postres' },
  { id: '8', name: 'Picarones', price: 8.50, category: 'Postres' },
  { id: '9', name: 'Mazamorra Morada', price: 7.50, category: 'Postres' },
  // Bebidas
  { id: '10', name: 'Chicha Morada', price: 4.00, category: 'Bebidas' },
  { id: '11', name: 'Inca Kola', price: 3.50, category: 'Bebidas' },
  { id: '12', name: 'Pisco Sour', price: 10.00, category: 'Bebidas' },
];


const initialTables: Table[] = [
  { id: 1, name: "Mesa 1", status: "free", order: [] },
  { id: 2, name: "Mesa 2", status: "occupied", order: [
      { ...initialMenu[3], quantity: 1, notes: 'Término medio' },
      { ...initialMenu[4], quantity: 1, notes: '' },
      { ...initialMenu[10], quantity: 2, notes: 'Con hielo' },
  ], waiterName: 'Juan Pérez' },
  { id: 3, name: "Mesa 3", status: "free", order: [] },
  { id: 4, name: "Mesa 4", status: "reserved", order: [] },
  { id: 5, name: "Mesa 5", status: "occupied", order: [
      { ...initialMenu[0], quantity: 2, notes: 'Sin ají' },
      { ...initialMenu[9], quantity: 1, notes: '' },
      { ...initialMenu[11], quantity: 1, notes: '' },
  ], waiterName: 'Carlos Rivas' },
  { id: 6, name: "Mesa 6", status: "free", order: [] },
  { id: 7, name: "Mesa 7", status: "free", order: [] },
  { id: 8, name: "Mesa 8", status: "occupied", order: [
      { ...initialMenu[6], quantity: 2, notes: '' },
      { ...initialMenu[7], quantity: 2, notes: 'Miel extra' },
  ], waiterName: 'Juan Pérez' },
  { id: 9, name: "Mesa 9", status: "free", order: [] },
  { id: 10, name: "Mesa 10", status: "reserved", order: [] },
  { id: 11, name: "Mesa 11", status: "free", order: [] },
  { id: 12, name: "Mesa 12", status: "free", order: [] },
];

const initialEmployees: Employee[] = [
    { id: 'emp-1', name: 'Juan Pérez', role: 'waiter', pin: '1234' },
    { id: 'emp-2', name: 'María García', role: 'cashier', pin: '5678' },
    { id: 'emp-3', name: 'Carlos Rivas', role: 'waiter', pin: '1111' },
];

// Use a global variable to preserve the state across hot reloads in development.
if (!global.menu) {
  global.menu = JSON.parse(JSON.stringify(initialMenu));
}
export const menu: MenuItem[] = global.menu as MenuItem[];


if (!global.tables) {
  // Deep clone to prevent mutations from affecting the initial data object on subsequent reloads.
  global.tables = JSON.parse(JSON.stringify(initialTables));
}
export const tables: Table[] = global.tables as Table[];

if (!global.transactions) {
    global.transactions = [];
}
export const transactions: Transaction[] = global.transactions as Transaction[];

if (!global.employees) {
    global.employees = JSON.parse(JSON.stringify(initialEmployees));
}
export const employees: Employee[] = global.employees as Employee[];


export const getTableById = (id: number): Table | undefined => {
  return tables.find(table => table.id === id);
}
