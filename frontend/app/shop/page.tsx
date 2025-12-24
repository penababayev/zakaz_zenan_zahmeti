import Link from "next/link";
import { headers } from "next/headers"; 

type Product = {
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

type ProductsResponse = {
  count: number;
  results: Product[];
};
  export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category_id?: string }>;
}) {
  const params = await searchParams;
  const q = params?.q ?? "";
  const category_id = params?.category_id ?? "";

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (category_id) qs.set("category_id", category_id);

  const url = `/api/products${qs.toString() ? `?${qs}` : ""}`;

  let data: ProductsResponse = { count: 0, results: [] };

  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}${url}`, { cache: "no-store" });
    if (res.ok) data = await res.json();
  } catch {}

  const products = data.results ?? [];



  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Shop</h1>
          <p className="text-sm text-black/60">
            {data.count} ürün bulundu
          </p>
        </div>

        {/* FILTER */}
        <form action="/shop" method="GET" className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search..."
            className="border rounded px-3 py-2"
          />

          <select
            name="category_id"
            defaultValue={category_id}
            className="border rounded px-3 py-2"
          >
            <option value="">All categories</option>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
            <option value="3">Category 3</option>
          </select>

          <button className="bg-black text-white px-4 py-2 rounded">
            Apply
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/shop/${p.id}`} 
            className="border rounded p-4 hover:shadow"
          >
            <img
              src={p.images?.[0] || "/mock/placeholder.jpg"}
              className="w-full h-40 object-cover rounded"
              alt={p.name_en}
            />

            <h3 className="mt-2 font-medium">{p.name_en}</h3>

            <div className="mt-1 font-semibold">
              {p.sale_price ?? p.price} ₺
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-8 text-center text-black/60">
          Ürün bulunamadı.
        </div>
      )}
    </div>
  );
}
