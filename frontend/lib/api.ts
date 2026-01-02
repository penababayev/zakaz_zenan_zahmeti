// src/lib/api.ts
import type { Product } from "@/constants/types"; // sende Product burada ise burada kalsın

export type ProductsQuery = {
  q?: string;
  category_id?: number;
  price_min?: number;
  price_max?: number;
  limit?: number;
  offset?: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8001";

function buildQuery(params: ProductsQuery) {
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (typeof params.category_id === "number") sp.set("category_id", String(params.category_id));
  if (typeof params.price_min === "number") sp.set("price_min", String(params.price_min));
  if (typeof params.price_max === "number") sp.set("price_max", String(params.price_max));
  if (typeof params.limit === "number") sp.set("limit", String(params.limit));
  if (typeof params.offset === "number") sp.set("offset", String(params.offset));

  return sp.toString();
}

async function parseOrThrow(res: Response, msg: string) {
  if (res.ok) return res.json();
  const text = await res.text().catch(() => "");
  throw new Error(`${msg} (${res.status}): ${text}`);
}

export async function getProducts(params: ProductsQuery = {}): Promise<Product[]> {
  const qs = buildQuery(params);
  const url = `${API_BASE}/products${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  return parseOrThrow(res, "GET /products failed");
}

export async function getProductDetail(productId: number | string): Promise<Product> {
  const url = `${API_BASE}/products/${productId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  return parseOrThrow(res, `GET /products/${productId} failed`);
}
