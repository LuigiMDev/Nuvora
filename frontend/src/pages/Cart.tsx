import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/states/cart";
import { useShallow } from "zustand/react/shallow";
import { useProducts } from "@/states/products";
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/cart";
import { useOrders } from "@/states/orders";
import { useUser } from "@/states/user";
import { toast } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems, removeItemToCart] = useCart(
    useShallow((state) => [
      state.cartItems,
      state.setCartItems,
      state.removeItemToCart,
    ])
  );
  const [user, isCheckingAuth] = useUser(
    useShallow((state) => [state.user, state.isCheckingAuth])
  );
  const products = useProducts((state) => state.products);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orders, setOrders] = useOrders(
    useShallow((state) => [state.orders, state.setOrders])
  );
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemToCart(id);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.productId === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("nuvora-cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("nuvora-cart", JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const productsById = useMemo(() => {
    const map = new Map<number, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const productsInCart = cartItems
    .map((item) => {
      const product = productsById.get(item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((item): item is CartItem => item !== null);

  const getTotalItems = () => {
    return productsInCart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return (
      productsInCart.reduce(
        (total, item) => total + item.priceInCents * item.quantity,
        0
      ) / 100
    );
  };

  const getTotalDiscount = () => {
    return productsInCart.reduce((total, item) => {
      if (item.discountInPercent && item.discountInPercent > 0) {
        const discountAmount =
          ((item.priceInCents - item.priceWithDiscountInCents) *
            item.quantity) /
          100;
        return total + discountAmount;
      }
      return total;
    }, 0);
  };

  const finalizeOrder = async () => {
    setIsProcessingOrder(true);
    try {
      if (!user) {
        throw new Error("É necessário fazer login para finalizar um pedido!");
      }

      if (!isCheckingAuth) {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ products: cartItems }),
        });

        if (!res.ok) {
          throw new Error("Ocorreu um erro ao criar o pedido!");
        }

        const newOrder = await res.json();

        console.log("orders antes do update:", orders);

        setOrders([...orders, newOrder]);

        console.log("orders depois do update:", orders);

        clearCart();
        setOrderSuccess(true);

        setTimeout(() => {
          navigate("/Orders");
        }, 3000);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "É necessário fazer login para finalizar um pedido!"
      ) {
        toast.error(error.message);
        navigate("/login");
      }
      console.error("Erro ao finalizar pedido:", error);
    }
    setIsProcessingOrder(false);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center p-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido realizado com sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Você será redirecionado para a página de pedidos em alguns segundos.
          </p>
          <Link to={"/Orders"}>
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)]">
              Ver Meus Pedidos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center p-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Que tal adicionar alguns produtos incríveis?
          </p>
          <Link to={"/"}>
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)]">
              Continuar Comprando
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to={"/"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Carrinho de Compras
          </h1>
          <p className="text-gray-600">
            {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} no carrinho
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {productsInCart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={item.images[0].imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "/fallback_image.svg")
                    }
                  />
                  <div className="flex-1">
                    <Link
                      to={`/Product?${item.id}`}
                      className="font-semibold text-gray-900 hover:text-[var(--primary)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-[var(--primary)]">
                        {(item.priceWithDiscountInCents / 100).toLocaleString(
                          "pt-br",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </span>
                      {item.discountInPercent && item.discountInPercent > 0 && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            {(item.priceInCents / 100).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            -{item.discountInPercent}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItemToCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-r-none"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 py-1 border-x text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-l-none"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Carrinho
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-32">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({getTotalItems()} itens)</span>
                <span>
                  R$ {(getTotalPrice() + getTotalDiscount()).toFixed(2)}
                </span>
              </div>

              {getTotalDiscount() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-R$ {getTotalDiscount().toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-green-600">
                <span>Frete</span>
                <span>Grátis</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[var(--primary)]">
                  R$ {getTotalPrice().toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white"
                onClick={finalizeOrder}
                disabled={isProcessingOrder}
              >
                {isProcessingOrder ? "Processando..." : "Finalizar Pedido"}
              </Button>

              <Link to={"/"}>
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
