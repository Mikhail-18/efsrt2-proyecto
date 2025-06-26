export type TableStatus = 'free' | 'occupied' | 'reserved';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Entradas' | 'Platos Principales' | 'Postres' | 'Bebidas';
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Table {
  id: number;
  name: string;
  status: TableStatus;
  order: OrderItem[];
}

export const menu: MenuItem[] = [
  { id: '1', name: 'Bruschetta con Tomate', price: 8.50, category: 'Entradas' },
  { id: '2', name: 'Ensalada Caprese', price: 9.00, category: 'Entradas' },
  { id: '3', name: 'Carpaccio de Res', price: 12.00, category: 'Entradas' },
  { id: '4', name: 'Lasaña a la Boloñesa', price: 15.00, category: 'Platos Principales' },
  { id: '5', name: 'Risotto de Hongos', price: 16.50, category: 'Platos Principales' },
  { id: '6', name: 'Salmón a la Parrilla', price: 18.00, category: 'Platos Principales' },
  { id: '7', name: 'Tiramisú Clásico', price: 7.00, category: 'Postres' },
  { id: '8', name: 'Panna Cotta con Frutos Rojos', price: 6.50, category: 'Postres' },
  { id: '9', name: 'Agua Mineral sin Gas', price: 2.50, category: 'Bebidas' },
  { id: '10', name: 'Copa de Vino Tinto', price: 5.00, category: 'Bebidas' },
  { id: '11', name: 'Refresco de Cola', price: 3.00, category: 'Bebidas' },
];

// This is a workaround to simulate a database in a development/serverless environment
// where module-level variables can be re-initialized on each request/hot-reload.
declare global {
  var tables: Table[] | undefined;
}

const initialTables: Table[] = [
  { id: 1, name: "Mesa 1", status: "free", order: [] },
  { id: 2, name: "Mesa 2", status: "occupied", order: [
      { ...menu[3], quantity: 1 },
      { ...menu[4], quantity: 1 },
      { ...menu[10], quantity: 2 },
  ] },
  { id: 3, name: "Mesa 3", status: "free", order: [] },
  { id: 4, name: "Mesa 4", status: "reserved", order: [] },
  { id: 5, name: "Mesa 5", status: "occupied", order: [
      { ...menu[0], quantity: 2 },
      { ...menu[8], quantity: 1 },
      { ...menu[9], quantity: 1 },
  ] },
  { id: 6, name: "Mesa 6", status: "free", order: [] },
  { id: 7, name: "Mesa 7", status: "free", order: [] },
  { id: 8, name: "Mesa 8", status: "occupied", order: [
      { ...menu[6], quantity: 2 },
      { ...menu[7], quantity: 2 },
  ] },
  { id: 9, name: "Mesa 9", status: "free", order: [] },
  { id: 10, name: "Mesa 10", status: "reserved", order: [] },
  { id: 11, name: "Mesa 11", status: "free", order: [] },
  { id: 12, name: "Mesa 12", status: "free", order: [] },
];

// Use a global variable to preserve the state across hot reloads in development.
if (!global.tables) {
  // Deep clone to prevent mutations from affecting the initial data object on subsequent reloads.
  global.tables = JSON.parse(JSON.stringify(initialTables));
}

export const tables: Table[] = global.tables as Table[];


export const getTableById = (id: number): Table | undefined => {
  return tables.find(table => table.id === id);
}
