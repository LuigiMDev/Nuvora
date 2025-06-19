export type OrderResponse = {
  id: string;
  createdAt: Date;
  totalPriceInCents: number;
  orderProduct: {
    product: {
      id: number,
      name: string
    }
    priceInCents: number;
    hasdiscount: boolean;
    discountInPercent: number | null;
    priceWithDiscountInCents: number;
    quantity: number;
  }[];
};
