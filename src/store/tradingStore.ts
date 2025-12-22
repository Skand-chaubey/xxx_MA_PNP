import { create } from 'zustand';
import { Order } from '@/types';

interface TradingState {
  orders: Order[];
  activeOrders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setOrders: (orders: Order[]) => void;
  getActiveOrders: () => Order[];
}

export const useTradingStore = create<TradingState>((set, get) => ({
  orders: [],
  activeOrders: [],

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      activeOrders:
        order.status === 'confirmed' || order.status === 'in_progress'
          ? [...state.activeOrders, order]
          : state.activeOrders,
    })),

  updateOrder: (orderId, updates) =>
    set((state) => {
      const updatedOrders = state.orders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      );
      const updatedActiveOrders = updatedOrders.filter(
        (order) => order.status === 'confirmed' || order.status === 'in_progress'
      );
      return {
        orders: updatedOrders,
        activeOrders: updatedActiveOrders,
      };
    }),

  setOrders: (orders) =>
    set({
      orders,
      activeOrders: orders.filter(
        (order) => order.status === 'confirmed' || order.status === 'in_progress'
      ),
    }),

  getActiveOrders: () => {
    return get().orders.filter(
      (order) => order.status === 'confirmed' || order.status === 'in_progress'
    );
  },
}));

