import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Table, Order, MenuItem, Notification, Waiter, TableStatus, OrderStatus } from '../types';

interface RestaurantContextType {
  tables: Table[];
  orders: Order[];
  menu: MenuItem[];
  notifications: Notification[];
  waiters: Waiter[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  placeOrder: (tableId: string, items: any[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  callWaiter: (tableId: string) => void;
  notifyOrderReady: (tableId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  assignWaiterToTable: (tableId: string, waiterId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([
    { id: 't1', number: 1, waiterId: 'w1', status: 'available' },
    { id: 't2', number: 2, waiterId: 'w1', status: 'available' },
    { id: 't3', number: 3, waiterId: 'w2', status: 'available' },
    { id: 't4', number: 4, waiterId: 'w2', status: 'available' },
    { id: 't5', number: 5, waiterId: 'w1', status: 'available' },
    { id: 't6', number: 6, waiterId: 'w2', status: 'available' },
  ]);

  const [waiters] = useState<Waiter[]>([
    { id: 'w1', name: 'John Doe' },
    { id: 'w2', name: 'Jane Smith' },
  ]);

  const [menu] = useState<MenuItem[]>([
    { id: 'm1', name: 'Wagyu Burger', description: 'Gourmet wagyu beef burger with caramelized onions and truffle fries', price: 24, category: 'mains', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/burger-31984df8-1776165476047.webp' },
    { id: 'm2', name: 'Carbonara', description: 'Fresh handmade fettuccine carbonara with pancetta and parmigiano reggiano', price: 18, category: 'mains', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/pasta-ef76ce90-1776165475656.webp' },
    { id: 'm3', name: 'Quinoa Salad', description: 'Vibrant mediterranean quinoa salad with avocado and roasted chickpeas', price: 14, category: 'starters', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/salad-0853c228-1776165475418.webp' },
    { id: 'm4', name: 'Sushi Platter', description: 'Assorted premium sushi platter with tuna, salmon, and yellowtail', price: 32, category: 'mains', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/sushi-55d64e86-1776165475790.webp' },
    { id: 'm5', name: 'Lava Cake', description: 'Decadent chocolate lava cake with vanilla bean ice cream', price: 12, category: 'desserts', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/dessert-dc2f075c-1776165476581.webp' },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const placeOrder = (tableId: string, items: any[]) => {
    const table = tables.find(t => t.id === tableId);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      tableId,
      items,
      status: 'pending',
      timestamp: new Date(),
      preparationTime: 20, // Default prep time
      assignedWaiterId: table?.waiterId || '',
    };
    setOrders(prev => [...prev, newOrder]);
    updateTableStatus(tableId, 'waiting_for_food');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (status === 'ready') {
          notifyOrderReady(o.tableId);
        }
        return { ...o, status };
      }
      return o;
    }));
  };

  const notifyOrderReady = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'order_ready',
        tableId: table.id,
        waiterId: table.waiterId,
        message: `Table ${table.number} order is ready!`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications(prev => [...prev, newNotification]);
      updateTableStatus(tableId, 'ready_to_serve');
    }
  };

  const callWaiter = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'call',
        tableId: table.id,
        waiterId: table.waiterId,
        message: `Table ${table.number} is calling!`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications(prev => [...prev, newNotification]);
      updateTableStatus(tableId, 'needs_service');
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const assignWaiterToTable = (tableId: string, waiterId: string) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, waiterId, status: 'occupied' } : t));
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assigned',
        tableId,
        waiterId,
        message: `Assigned to Table ${table.number}`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  return (
    <RestaurantContext.Provider value={{
      tables, orders, menu, notifications, waiters,
      updateTableStatus, placeOrder, updateOrderStatus, callWaiter, notifyOrderReady, markNotificationRead, assignWaiterToTable
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within a RestaurantProvider');
  return context;
};