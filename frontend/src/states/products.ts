import type { Product } from "@/types/products";
import { create } from "zustand";

type ProductState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  error: string | null;
};

export const useProducts = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  loading: true,
  error: null,
}));
