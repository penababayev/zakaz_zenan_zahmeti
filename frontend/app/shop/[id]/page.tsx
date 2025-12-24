import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

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

async function fetchProduct(id: number): Promise<Product | null> {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Product;
}

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Promise
}) {
  const { id } = await params;      // ✅ await
  const productId = Number(id);

  if (!Number.isFinite(productId)) notFound();

  const product = await fetchProduct(productId);
  if (!product) notFound();

  const title = product.name_en || product.name_ro;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="text-sm text-black/60 mb-4">
        <Link href="/shop" className="underline">Shop</Link>
        <span className="mx-2">/</span>
        <span>{title}</span>
      </div>

      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-black/70">
        {product.description_en || product.description_ro || ""}
      </p>

      <div className="mt-4 text-2xl font-semibold">
        {product.sale_price ?? product.price} ₺
      </div>
    </div>
  );
}
