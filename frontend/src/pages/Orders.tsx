import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useOrders } from "@/states/orders";
import { useShallow } from "zustand/react/shallow";
import { useUser } from "@/states/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Orders() {
  const [orders, isFindOrders] = useOrders(
    useShallow((state) => [state.orders, state.isFindOrders])
  );
  const [user, isCheckingAuth] = useUser(
    useShallow((state) => [state.user, state.isCheckingAuth])
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      toast.warn("É preciso estar logado para acessar esta página!");
      navigate("/");
    }
  }, [user, isCheckingAuth, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "DELIVERED":
        return "Entregue";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  if (isFindOrders) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
        <p className="text-gray-600">
          Acompanhe seus pedidos e histórico de compras
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center p-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Você ainda não fez nenhum pedido. Que tal começar a explorar nossos
            produtos?
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      Pedido #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      {format(
                        new Date(order.createdAt),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </Badge>
                    <span className="text-lg font-bold text-[var(--primary)]">
                      {(order.totalPriceInCents / 100).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Itens do pedido:
                  </h4>
                  {order.orderProduct.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-gray-600 ml-2">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">
                          {(
                            (item.priceWithDiscountInCents * item.quantity) /
                            100
                          ).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                        {item.discountInPercent &&
                          item.discountInPercent > 0 && (
                            <div className="text-sm text-green-600">
                              Desconto: {item.discountInPercent}%
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
