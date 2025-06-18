export type Product = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  hasdiscount: boolean;
  discountInPercent?: number;
  priceWithDiscountInCents: number;
  images: string[];
  category: string;
  material: string;
  supplier: "BRAZILIAN" | "EUROPEAN";
};
