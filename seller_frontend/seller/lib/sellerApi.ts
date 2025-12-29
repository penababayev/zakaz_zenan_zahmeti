// lib/sellerApi.ts
export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at?: string;
};

export type ProductCreate = {
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  is_active?: boolean; // backend ister/istemez, UI'de biz true basıyoruz
};

export type ProductPatch = Partial<ProductCreate>;

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
};

export type Order = {
  id: number;
  status: string;
  total: number;
  created_at?: string;
};

export type OrderDetail = {
  order: Order;
  items: Array<{
    id: number;
    product_id: number;
    qty: number;
    unit_price: number;
  }>;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  // ✅ HeadersInit yerine net obje
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

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


// -------- Products --------
export const getMyProducts = () =>
  request<Product[]>("/seller/products", { method: "GET" });

export const createProduct = (payload: ProductCreate) =>
  request<Product>("/seller/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const patchProduct = (productId: number, payload: ProductPatch) =>
  request<Product>(`/seller/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const replaceProduct = (productId: number, payload: Product) =>
  request<Product>(`/seller/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const updateStock = (productId: number, stock_quantity: number) =>
  request<{ ok: boolean; stock_quantity: number }>(
    `/seller/products/${productId}/stock`,
    {
      method: "PATCH",
      body: JSON.stringify({ stock_quantity }),
    }
  );

// -------- Images --------
export const uploadProductImage = (productId: number, file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return request<ProductImage>(`/seller/products/${productId}/images`, {
    method: "POST",
    body: fd,
  });
};

export const getProductImages = (productId: number) =>
  request<ProductImage[]>(`/seller/products/${productId}/images`, {
    method: "GET",
  });

export const deleteProductImage = (productId: number, imageId: number) =>
  request<{ ok: boolean }>(
    `/seller/products/${productId}/images/${imageId}`,
    { method: "DELETE" }
  );

// -------- Orders --------
export const getSellerOrders = () =>
  request<Order[]>("/seller/orders", { method: "GET" });

export const getSellerOrderDetail = (orderId: number) =>
  request<OrderDetail>(`/seller/orders/${orderId}`, { method: "GET" });
