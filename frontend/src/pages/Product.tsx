import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "@/states/products";
import type { Product } from "@/types/products";
import { useCart } from "@/states/cart";

export default function ProductPage() {
  const products = useProducts((state) => state.products);
  const addItemToCart = useCart((state) => state.addItemToCart);
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const loadProduct = useCallback(
    (id: number) => {
      setIsLoading(true);
      try {
        const productData = products.find((p) => p.id === id);
        setProduct(productData);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
      setIsLoading(false);
    },
    [setIsLoading, setProduct, products]
  );

  useEffect(() => {
    if (productId) {
      loadProduct(Number(productId));
    } else {
      navigate("/");
    }
  }, [navigate, loadProduct, productId]);

  const addToCart = () => {
    if (!product) return;

    addItemToCart(product.id, quantity);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Produto não encontrado
        </h1>
        <Button onClick={() => navigate("/")}>Voltar ao início</Button>
      </div>
    );
  }

  const discountedPrice =
    product.discountInPercent && product.discountInPercent > 0
      ? (product.priceInCents * (1 - product.discountInPercent / 100)) / 100
      : product.priceInCents / 100;

  const fallbackImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop";
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ imageUrl: fallbackImage }];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={images[currentImageIndex].imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            {product.discountInPercent && product.discountInPercent > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                -{product.discountInPercent}%
              </Badge>
            )}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex
                      ? "border-[var(--primary)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {product.category}
              </Badge>
              <Badge
                className={
                  product.supplier === "BRAZILIAN"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {product.supplier === "BRAZILIAN"
                  ? "🇧🇷 Nacional"
                  : "🇪🇺 Europeu"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 capitalize">
              Material: {product.material}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[var(--primary)]">
              {discountedPrice.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            {product.discountInPercent && product.discountInPercent > 0 && (
              <span className="text-xl text-gray-400 line-through">
                {(product.priceInCents / 100).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-900">Quantidade:</label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-l-none"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Frete grátis para todo o Brasil
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Garantia de 1 ano
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">
                    Troca grátis em 30 dias
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
