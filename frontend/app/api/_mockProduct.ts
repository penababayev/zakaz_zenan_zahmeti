export type Product = {
  id: number;
  name_en: string;
  name_ro: string;
  slug: string;
  description_en?: string;
  description_ro?: string;
  price: number;
  sale_price?: number | null;
  category_id: number;
  stock_quantity: number;
  is_active: boolean;
  has_variants: boolean;
  is_featured: boolean;
  is_top_product: boolean;
  images: string[];
  created_at: string;
};

export const products: Product[] = [
  {
    id: 101,
    name_en: "Handmade Bag",
    name_ro: "Geantă lucrată manual",
    slug: "handmade-bag",
    description_en: "A beautiful handmade bag.",
    description_ro: "O geantă frumoasă lucrată manual.",
    price: 120,
    sale_price: 99,
    category_id: 1,
    stock_quantity: 12,
    is_active: true,
    has_variants: false,
    is_featured: true,
    is_top_product: false,
    images: ["/mock/bag-1.jpg", "/mock/bag-2.jpg"],
    created_at: new Date().toISOString(),
  },
  {
    id: 102,
    name_en: "Natural Soap",
    name_ro: "Săpun natural",
    slug: "natural-soap",
    description_en: "Natural handmade soap.",
    description_ro: "Săpun natural lucrat manual.",
    price: 15,
    sale_price: null,
    category_id: 2,
    stock_quantity: 50,
    is_active: true,
    has_variants: false,
    is_featured: false,
    is_top_product: true,
    images: ["/mock/soap-1.jpg"],
    created_at: new Date().toISOString(),
  },
  {
    id: 103,
    name_en: "Wooden Tray",
    name_ro: "Tavă din lemn",
    slug: "wooden-tray",
    description_en: "Handcrafted wooden tray.",
    description_ro: "Tavă din lemn lucrată manual.",
    price: 35,
    sale_price: null,
    category_id: 3,
    stock_quantity: 8,
    is_active: true,
    has_variants: false,
    is_featured: false,
    is_top_product: false,
    images: ["/mock/tray-1.jpg"],
    created_at: new Date().toISOString(),
  },
];
