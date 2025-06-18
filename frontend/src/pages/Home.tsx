import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Package, Truck, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useProducts } from "@/states/products";
import { useShallow } from "zustand/react/shallow";
import type { Product } from "@/types/products";

type FilterKey = "category" | "material" | "supplier" | "search";
type ActiveFilters = Partial<Record<FilterKey, string>>;

export default function Home() {
  const [products, isLoading] = useProducts(
    useShallow((state) => [state.products, state.loading])
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const location = useLocation();

  useEffect(() => {
    parseUrlFilters();
  }, [location.search]);

  const parseUrlFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filters: ActiveFilters = {};

    if (urlParams.get("category"))
      filters.category = urlParams.get("category")!;
    if (urlParams.get("material"))
      filters.material = urlParams.get("material")!;
    if (urlParams.get("supplier"))
      filters.supplier = urlParams.get("supplier")!;
    if (urlParams.get("search")) filters.search = urlParams.get("search")!;

    setActiveFilters(filters);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    if (activeFilters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(activeFilters.search!.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(activeFilters.search!.toLowerCase())
      );
    }

    if (activeFilters.category) {
      filtered = filtered.filter(
        (product) => product.category === activeFilters.category
      );
    }

    if (activeFilters.material) {
      filtered = filtered.filter(
        (product) => product.material === activeFilters.material
      );
    }

    if (activeFilters.supplier) {
      filtered = filtered.filter(
        (product) => product.supplier === activeFilters.supplier
      );
    }

    setFilteredProducts(filtered);
  }, [setFilteredProducts, activeFilters, products]);

  useEffect(() => {
    applyFilters();
  }, [products, activeFilters, applyFilters]);

  const removeFilter = (filterKey: FilterKey) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(filterKey);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    parseUrlFilters();
  };

  const clearAllFilters = () => {
    window.history.pushState({}, "", window.location.pathname);
    parseUrlFilters();
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {!hasActiveFilters && (
        <section className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bem-vindo à <span className="text-yellow-300">Nuvora</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-blue-100 max-w-3xl mx-auto">
                Descubra produtos incríveis com os melhores preços e qualidade
                garantida
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span>Frete Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Produtos Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>Entrega Rápida</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Filtros ativos:
              </span>
              {Object.entries(activeFilters).map(([key, value]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-100 text-blue-800"
                >
                  {value}
                  <button
                    onClick={() => removeFilter(key as FilterKey)}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 h-auto py-1 px-2"
              >
                Limpar todos
              </Button>
            </div>
          </div>
        )}

        <section>
          {!hasActiveFilters && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Todos os Produtos
                </h2>
                <p className="text-gray-600">
                  {isLoading
                    ? "Carregando produtos..."
                    : `${products.length} produtos disponíveis`}
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center col-span-full">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar ou limpar os filtros para ver mais produtos.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearAllFilters} variant="outline">
                  Limpar Filtros
                </Button>
              )}
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
