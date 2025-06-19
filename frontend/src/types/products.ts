export interface Product {
  id: number;
  name: string;
  description: string;
  priceInCents: number;
  hasdiscount: boolean;
  discountInPercent?: number;
  priceWithDiscountInCents: number;
  images: {imageUrl: string}[];
  category: string;
  material: string;
  supplier: "BRAZILIAN" | "EUROPEAN";
};
