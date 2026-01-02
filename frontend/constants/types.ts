export type SellerMini = {
  id: number;
  username: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;

  price: string | number;
  currency: string;

  stock_quantity: number;
  description: string;

  images: string[];

  category_id: number;
  category_name: string;

  shop_name: string;
  location: string;
  phone_number: string;

  // detail extras
  status: string;
  is_handmade: boolean;
  created_at: string; // ISO datetime
  seller: SellerMini;
  is_favorited: boolean;
};
