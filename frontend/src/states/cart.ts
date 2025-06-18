import { toast } from "react-toastify";
import { create } from "zustand";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  addItemToCart: (productId: number) => void;
  removeItemToCart: (productId: number) => void;
};

export const useCart = create<CartState>((set, get) => ({
  cartItems: [],
  setCartItems: (cartItems: CartItem[]) => set({ cartItems }),
  addItemToCart: (productId: number) => {
    const { setCartItems } = get();
    const cartItem = {
      id: productId,
      quantity: 1,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("nuvora-cart") || "[]"
    );
    const existingItemIndex = existingCart.findIndex(
      (item: typeof cartItem) => item.id === productId
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    setCartItems(existingCart);

    localStorage.setItem("nuvora-cart", JSON.stringify(existingCart));
    toast.success("Produto adicionado no carrinho")
  },
  removeItemToCart: (productId: number) => {
    const { setCartItems } = get();

    const existingCart = JSON.parse(localStorage.getItem("nuvora-cart") || "");

    if (Array.isArray(existingCart)) {
      existingCart.filter((p) => p.id !== productId);
      localStorage.setItem("nuvora-cart", JSON.stringify(existingCart));
      setCartItems(existingCart);
    }
  },
}));
