export type Product = {
  id: number;
  title: string;
  slug: string;
  price: string; // backend "Decimal" gibi string dönebilir
  currency: string;
  stock_quantity: number;
  description: string;
  images: string[];
  category_id: number;
  category_name: string;
  shop_name: string;
  location: string;
  phone_number: string;
};
