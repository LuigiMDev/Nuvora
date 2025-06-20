import { toast } from "react-toastify";
import { create } from "zustand";

type CartItem = {
  productId: number;
  quantity: number;
};

type CartState = {
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  addItemToCart: (productId: number, quantity?: number) => void;
  removeItemToCart: (productId: number) => void;
};

export const useCart = create<CartState>((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem("nuvora-cart") || "[]"),
  setCartItems: (cartItems: CartItem[]) => set({ cartItems }),
  addItemToCart: (productId: number, quantity: number = 1) => {
    const { setCartItems } = get();
    const cartItem = {
      productId,
      quantity,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("nuvora-cart") || "[]"
    );
    const existingItemIndex = existingCart.findIndex(
      (item: typeof cartItem) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    setCartItems(existingCart);

    localStorage.setItem("nuvora-cart", JSON.stringify(existingCart));
    toast.success("Produto adicionado ao carrinho");
  },
  removeItemToCart: (productId: number) => {
    const { setCartItems } = get();

    const existingCart = JSON.parse(localStorage.getItem("nuvora-cart") || "");

    if (Array.isArray(existingCart)) {
      const newCart = existingCart.filter((p) => p.productId !== productId);
      localStorage.setItem("nuvora-cart", JSON.stringify(newCart));
      setCartItems(newCart);
    }
  },
}));
