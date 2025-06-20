import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import type { MouseEvent } from "react";
import type { Product } from "@/types/products";
import { useCart } from "@/states/cart";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.discountInPercent && product.discountInPercent > 0
      ? (product.priceInCents * (1 - product.discountInPercent / 100)) / 100
      : product.priceInCents / 100;

  const fallbackImage =
    "/fallback_image.svg";
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : fallbackImage;

  const addItemToCart = useCart((state) => state.addItemToCart);

  const addToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addItemToCart(product.id);
  };

  const supplierBadgeColor =
    product.supplier === "BRAZILIAN"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  return (
    <Link to={`/product/${product.id}`}>
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
          {product.discountInPercent && product.discountInPercent > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-semibold text-xs">
              -{product.discountInPercent}%
            </Badge>
          )}
          <Badge
            className={`absolute top-2 right-2 ${supplierBadgeColor} font-semibold text-xs`}
          >{product.supplier === "BRAZILIAN" ? "Nacional" : "Europeu"}</Badge>
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
              {product.discountInPercent && product.discountInPercent > 0 ? (
                <>
                  <span className="text-base font-bold text-[var(--primary)]">
                    {discountedPrice.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {(product.priceInCents / 100).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-gray-900">
                  {(product.priceInCents / 100).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
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
