import type { Product } from "@/types/products";
import { create } from "zustand";

type ProductState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const useProducts = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  loading: true,
  setIsLoading: (loading) => set({ loading }),
}));
