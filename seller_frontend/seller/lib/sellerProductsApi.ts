// lib/sellerProductsApi.ts

export type SellerProduct = {
  id: number;
  title: string;
  slug: string;
  price: string; // response: string (Decimal)
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

export type SellerProductStatus = "draft" | "active" | "inactive" | string;

export type GetSellerProductsParams = {
  status_in?: SellerProductStatus[];
  q?: string;
  limit?: number;
  offset?: number;
};

export type CreateSellerProductPayload = {
  title: string;
  price: number;
  stock_quantity: number;
  description: string;
  currency: string; // "EUR"
  category_id: number;
  status: SellerProductStatus; // "draft"
  is_handmade: boolean;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function buildQuery(params?: GetSellerProductsParams) {
  const sp = new URLSearchParams();

  if (params?.status_in?.length) {
    for (const s of params.status_in) sp.append("status_in", s);
  }
  if (params?.q) sp.set("q", params.q);
  if (typeof params?.limit === "number") sp.set("limit", String(params.limit));
  if (typeof params?.offset === "number") sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // JSON ise content-type bas
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

// ✅ GET /seller/products
export async function getSellerProducts(
  params?: GetSellerProductsParams
): Promise<SellerProduct[]> {
  const q = buildQuery(params);
  return request<SellerProduct[]>(`/seller/products${q}`, { method: "GET" });
}

// ✅ POST /seller/products
export async function createSellerProduct(
  payload: CreateSellerProductPayload
): Promise<SellerProduct> {
  return request<SellerProduct>("/seller/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


// ✅ PATCH /seller/products/{product_id} (minimal)
export type PatchSellerProductPayload = {
  title?: string;
  price?: number;
  status?: SellerProductStatus; // örn: "paused" da olabilir
};

export async function patchSellerProductMinimal(
  productId: number,
  payload: PatchSellerProductPayload
): Promise<SellerProduct> {
  return request<SellerProduct>(`/seller/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ✅ PUT /seller/products/{product_id} (replace / full update)
export type ReplaceSellerProductPayload = {
  title: string;
  price: number;
  description?: string;
  currency: string; // "EUR"
  category_id?: number;
  status: SellerProductStatus; // "draft"
  is_handmade: boolean;
};

export async function replaceSellerProduct(
  productId: number,
  payload: ReplaceSellerProductPayload
): Promise<SellerProduct> {
  return request<SellerProduct>(`/seller/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

