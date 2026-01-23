import type { Product } from "@/constants/types";

export type ProductsQuery = {
  q?: string;
  category_id?: number;
  price_min?: number;
  price_max?: number;
  limit?: number;
  offset?: number;
};

const API_BASE = "/api";

function buildQuery(params: ProductsQuery) {
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (typeof params.category_id === "number") sp.set("category_id", String(params.category_id));
  if (typeof params.price_min === "number") sp.set("price_min", String(params.price_min));
  if (typeof params.price_max === "number") sp.set("price_max", String(params.price_max));
  if (typeof params.limit === "number") sp.set("limit", String(params.limit));
  if (typeof params.offset === "number") sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}
async function parseOrThrow(res: Response, msg: string) {
  if (res.ok) return res.json();
  const text = await res.text().catch(() => "");
  throw new Error(`${msg} (${res.status}): ${text}`);
}

function normalizeProducts(payload: unknown): Product[] {
  // backend direkt liste döndürüyorsa
  if (Array.isArray(payload)) return payload as Product[];

  // bazı backend’ler { items: [...] } veya { data: [...] } gibi döndürür
  if (payload && typeof payload === "object") {
    const anyObj = payload as any;
    if (Array.isArray(anyObj.items)) return anyObj.items as Product[];
    if (Array.isArray(anyObj.data)) return anyObj.data as Product[];
    if (Array.isArray(anyObj.results)) return anyObj.results as Product[];
  }

  // hiçbirine uymuyorsa boş liste (istersen burada throw da yapabiliriz)
  return [];
}

export async function getProducts(params: ProductsQuery = {}): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products${buildQuery(params)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Products fetch failed: ${res.status} ${res.statusText} ${text}`);
  }

  // bazen backend HTML/plain text döndürür, garanti olsun diye:
  const raw = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  const items = normalizeProducts(raw);

  // Debug için istersen bunu geçici aç:
  // console.log("RAW PRODUCTS:", raw);

  return items;
}

export async function getProductDetail(productId: number | string): Promise<Product> {
  const id = Number(productId);
  if (!Number.isFinite(id)) {
    throw new Error(`productId must be an integer. Got: ${String(productId)}`);
  }

  const url = `${API_BASE}/products/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  return parseOrThrow(res, `GET /products/${id} failed`);
}