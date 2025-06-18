import React, { useState, useEffect, type FormEvent } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Package, LogOut, LogIn, Search } from "lucide-react";
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


export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // const [filtersOpen, setFiltersOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // const currentUser = await UserEntity.me();
        // setUser(currentUser);
      } catch{
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    const searchProducts = async () => {
      await fetch('/api/products')
     }

    checkAuth();

    const savedCart = localStorage.getItem('nuvora-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('nuvora-cart');
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart));
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSearchTerm(urlParams.get('search') || '');
  }, [location.search]);

  const categories = [
    { value: "eletronicos", label: "Eletrônicos" },
    { value: "roupas", label: "Roupas" },
    { value: "casa", label: "Casa" },
    { value: "esportes", label: "Esportes" },
    { value: "livros", label: "Livros" },
    { value: "beleza", label: "Beleza" },
    { value: "automotivo", label: "Automotivo" }
  ];
  const materials = [
    { value: "algodao", label: "Algodão" }, { value: "poliester", label: "Poliéster" }, { value: "couro", label: "Couro" }, { value: "metal", label: "Metal" }, { value: "plastico", label: "Plástico" }, { value: "madeira", label: "Madeira" }, { value: "vidro", label: "Vidro" }, { value: "ceramica", label: "Cerâmica" }
  ];
  const suppliers = [
    { value: "brasileiro", label: "🇧🇷 Nacional" }, { value: "europeu", label: "🇪🇺 Europeu" }
  ];
  const filterGroups = [
      { id: 'category', label: 'Categorias', items: categories },
      { id: 'material', label: 'Materiais', items: materials },
      { id: 'supplier', label: 'Fornecedores', items: suppliers },
  ];

  // const handleFilterClick = (filterType, filterValue) => {
  //   const params = new URLSearchParams(location.search);
  //   params.set(filterType, filterValue);
  //   navigate(`/?${params.toString()}`);
  //   setFiltersOpen(false);
  // };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    navigate(`/?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      // await UserEntity.logout();
      // setUser(null);
      // navigate("/");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLogin = async () => {
    try {
      // await UserEntity.login();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        :root {
          --primary: #2F52E0; --primary-dark: #1E3A8A; --primary-light: #3B82F6;
        }
      `}</style>

      <header className="bg-white shadow-sm border-b sticky top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4 flex-1">
              <Link to={"/"} className="flex items-center shrink-0">
                <img src="/nuvora_logo.png" alt="Nuvora" className="ml-2 w-24" />
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
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-[var(--primary)]">
                      {/* {cartItems.reduce((sum, item) => sum + item.quantity, 0)} */}
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
                    <DropdownMenuItem disabled>
                      Carregando...
                    </DropdownMenuItem>
                  ) : user ? (
                    <>
                      <div className="px-2 py-1.5 text-sm">
                        {/* <div className="font-medium">{user.full_name || user.email}</div> */}
                        {/* <div className="text-gray-500 text-xs">{user.email}</div> */}
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
                    <DropdownMenuItem onClick={handleLogin}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </DropdownMenuItem>
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

      <main className="pt-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="text-2xl font-bold text-[var(--primary)] mb-4">Nuvora</div>
                    <p className="text-gray-600 mb-4">Sua loja online de confiança. Produtos de qualidade com os melhores preços.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Links Rápidos</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to={"/"} className="text-gray-600 hover:text-[var(--primary)]">Início</Link></li>
                        <li><span className="text-gray-600">Sobre Nós</span></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
                    <ul className="space-y-2 text-sm">
                        <li><span className="text-gray-600">contato@nuvora.com</span></li>
                        <li><span className="text-gray-600">(11) 99999-9999</span></li>
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
