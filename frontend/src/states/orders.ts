import type { Order } from "@/types/order";
import { create } from "zustand";

type OrderState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  isFindOrders: boolean;
  setIsFindOrders: (isFindOrders: boolean) => void;
};

export const useOrders = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders: Order[]) => set({ orders }),
  isFindOrders: true,
  setIsFindOrders: (isFindOrders: boolean) => set({ isFindOrders }),
}));
