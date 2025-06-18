import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import type { MouseEvent } from "react";

// Tipo do produto
type Product = {
  id: string;
  name: string;
  category: string;
  material?: string;
  supplier: "BRAZILIAN" | "EUROPEAN";
  images?: string[];
  price: number;
  discount_percentage: number;
  featured?: boolean;
};

// Props do componente
type ProductCardProps = {
  product: Product;
};

// Função utilitária de URL (adicione se necessário)
const createPageUrl = (query: string) => `/product?${query}`;

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.discount_percentage > 0
      ? product.price * (1 - product.discount_percentage / 100)
      : product.price;

  const fallbackImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : fallbackImage;

  const addToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      name: product.name,
      price: discountedPrice,
      originalPrice: product.price,
      image: productImage,
      quantity: 1,
      discount: product.discount_percentage,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("nuvora-cart") || "[]"
    );
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("nuvora-cart", JSON.stringify(existingCart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const supplierBadgeColor =
    product.supplier === "BRAZILIAN"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  return (
    <Link to={createPageUrl(`id=${product.id}`)}>
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
        <div className="relative overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          {product.discount_percentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-semibold text-xs">
              -{product.discount_percentage}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destaque
            </Badge>
          )}
        </div>

        <CardContent className="p-3 flex flex-col flex-1">
          <div className="mb-2 flex-1">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 capitalize">
              {product.category} • {product.material}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {product.discount_percentage > 0 ? (
                <>
                  <span className="text-base font-bold text-[var(--primary)]">
                    R$ {discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    R$ {product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-gray-900">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              size="sm"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-1 shrink-0 h-8 px-2"
              onClick={addToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
