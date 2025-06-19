import type { Product } from "./products";

export type OrderProduct = {
  product: Product;
  priceInCents: number;
  hasdiscount: boolean;
  discountInPercent?: number;
  priceWithDiscountInCents: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderProduct: OrderProduct[];
  totalPriceInCents: number;
  createdAt: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
};
