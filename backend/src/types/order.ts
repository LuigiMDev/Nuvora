export type OrderResponse = {
  id: string;
  createdAt: Date;
  orderProduct: {
    productId: string;
    quantity: number;
  }[];
};
