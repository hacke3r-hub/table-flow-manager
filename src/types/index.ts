export type TableStatus = 'available' | 'occupied' | 'needs_service' | 'ordering' | 'waiting_for_food' | 'ready_to_serve' | 'pending';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  image: string;
}

export interface Table {
  id: string;
  number: number;
  waiterId: string;
  status: TableStatus;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: Date;
  preparationTime: number; // Estimated total prep time in minutes
  assignedWaiterId: string;
}

export interface Notification {
  id: string;
  type: 'call' | 'order_ready' | 'assigned';
  tableId: string;
  waiterId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type TableCallingNotification = Notification & { type: 'call' };
export type OrderReadyNotification = Notification & { type: 'order_ready' };

export interface Waiter {
  id: string;
  name: string;
}