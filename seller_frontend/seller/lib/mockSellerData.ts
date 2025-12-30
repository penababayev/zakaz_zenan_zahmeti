// lib/mockSellerData.ts
import type { Product, Order, ProductImage, OrderDetail } from "./sellerApi";

export const mockProducts: Product[] = [
  { id: 1, name: "Handmade Bag", price: 120, stock_quantity: 8, is_active: true },
  { id: 2, name: "Silver Ring", price: 45, stock_quantity: 30, is_active: true },
  { id: 3, name: "Wooden Toy", price: 25, stock_quantity: 0, is_active: false },
];

export const mockImages: Record<number, ProductImage[]> = {
  1: [{ id: 11, product_id: 1, url: "/mock/bag.jpg" }],
  2: [{ id: 21, product_id: 2, url: "/mock/ring.jpg" }],
  3: [],
};

export const mockOrders: Order[] = [
  { id: 101, status: "paid", total: 165, created_at: "2025-12-20" },
  { id: 102, status: "shipped", total: 45, created_at: "2025-12-22" },
];

export const mockOrderDetail: Record<number, OrderDetail> = {
  101: {
    order: { id: 101, status: "paid", total: 165, created_at: "2025-12-20" },
    items: [
      { id: 1, product_id: 1, qty: 1, unit_price: 120 },
      { id: 2, product_id: 2, qty: 1, unit_price: 45 },
    ],
  },
  102: {
    order: { id: 102, status: "shipped", total: 45, created_at: "2025-12-22" },
    items: [{ id: 3, product_id: 2, qty: 1, unit_price: 45 }],
  },
};
