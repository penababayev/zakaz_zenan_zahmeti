// types/product.ts
export interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  alt: string;
  position: number;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: string;
  currency: string;
  description: string;
  images: ProductImage[];
  category_id: number;
  category_name: string;
  shop_name: string;
  location: string;
  phone_number: string;
}
