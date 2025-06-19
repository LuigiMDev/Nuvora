import { useState, useEffect, type FormEvent, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Package,
  LogOut,
  LogIn,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DynamicFilterBar from "./components/DynamicFilterBar";
import { useProducts } from "./states/products";
import { useShallow } from "zustand/react/shallow";
import { useCart } from "./states/cart";
import { useUser } from "./states/user";
import { toast } from "react-toastify";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useCart((state) => state.cartItems);
  const [user, setUser] = useUser(
    useShallow((state) => [state.user, state.setUser])
  );
  const [searchTerm, setSearchTerm] = useState("");
  // const [filtersOpen, setFiltersOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [products, setProducts, setIsLoading] = useProducts(
    useShallow((state) => [
      state.products,
      state.setProducts,
      state.setIsLoading,
    ])
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/loginWithToken`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Token inválido ou expirado");
        }

        setUser(await res.json());
      } catch {
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    const searchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await res.json();
        setProducts(products);
      } catch {
        console.error("Erro ao buscar produtos");
      }
      setIsLoading(false);
    };

    checkAuth();
    searchProducts();
  }, [setIsLoading, setProducts, setUser]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSearchTerm(urlParams.get("search") || "");
  }, [location.search]);

  const categories = useMemo(() => {
    const unicCategories = new Set(products.map((p) => p.category));
    return Array.from(unicCategories).map((category) => ({
      value: category,
      label: category,
    }));
  }, [products]);

  const materials = useMemo(() => {
    const unicMaterials = new Set(products.map((p) => p.material));
    return Array.from(unicMaterials).map((material) => ({
      value: material,
      label: material,
    }));
  }, [products]);

  const suppliers = [
    { value: "BRAZILIAN", label: "🇧🇷 Nacional" },
    { value: "EUROPEAN", label: "🇪🇺 Europeu" },
  ];
  const filterGroups = [
    { id: "category", label: "Categorias", items: categories },
    { id: "material", label: "Materiais", items: materials },
    { id: "supplier", label: "Fornecedores", items: suppliers },
  ];

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    navigate(`/?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Ocorreu um erro ao fazer o logout!");
      }

      setUser(null);
    } catch (error) {
      toast.error("Não foi possível sair da sua conta!");
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4 flex-1">
              <Link to={"/"} className="flex items-center shrink-0">
                <img
                  src="/nuvora_logo.svg"
                  alt="Nuvora"
                  className="ml-2 w-24"
                />
              </Link>
              <div className="flex-1 max-w-lg mx-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="search"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </form>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Link to={"/Cart"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0  bg-[var(--primary)] text-[0.7rem]">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isCheckingAuth ? (
                    <DropdownMenuItem disabled>Carregando...</DropdownMenuItem>
                  ) : user ? (
                    <>
                      <div className="px-2 py-1.5 text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">
                          {user.email}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/Orders")}>
                        <Package className="w-4 h-4 mr-2" />
                        Meus Pedidos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                      <Link to="/login" className="flex items-center">
                        <LogIn className="w-4 h-4 mr-2" />
                        Entrar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="flex items-center">
                        <LogIn className="w-4 h-4 mr-2" />
                        Criar conta
                      </Link>
                    </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-16 left-0 right-0 z-40 h-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <DynamicFilterBar filterGroups={filterGroups} />
        </div>
      </div>

      <main className="">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-[var(--primary)] mb-4">
                Nuvora
              </div>
              <p className="text-gray-600 mb-4">
                Sua loja online de confiança. Produtos de qualidade com os
                melhores preços.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Links Rápidos
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to={"/"}
                    className="text-gray-600 hover:text-[var(--primary)]"
                  >
                    Início
                  </Link>
                </li>
                <li>
                  <span className="text-gray-600">Sobre Nós</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-gray-600">contato@nuvora.com</span>
                </li>
                <li>
                  <span className="text-gray-600">(11) 99999-9999</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-sm text-gray-600">
            © 2025 Nuvora. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
