import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Product } from "@/constants/types";
import { getProductDetail } from "@/lib/api";

export default function ProductDetailPage() {
  const router = useRouter();
  const { product_id } = router.query;

  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const idStr = String(product_id ?? "");
    if (!idStr) return;

    setLoading(true);
    setErr(null);

    getProductDetail(idStr)
      .then((data) => setItem(data))
      .catch((e: any) => setErr(e?.message ?? "Failed to load product detail"))
      .finally(() => setLoading(false));
  }, [router.isReady, product_id]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (err) return <div style={{ padding: 24, color: "red" }}>{err}</div>;
  if (!item) return <div style={{ padding: 24 }}>Not found.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{item.title}</h1>

      <p style={{ marginTop: 8, color: "#555" }}>
        {item.price} {item.currency} • stok: {item.stock_quantity}
      </p>

      <p style={{ marginTop: 8, color: "#555" }}>
        {item.category_name} (#{item.category_id})
      </p>

      <p style={{ marginTop: 8, color: "#555" }}>Shop: {item.shop_name}</p>
      <p style={{ marginTop: 8, color: "#555" }}>Location: {item.location}</p>
      <p style={{ marginTop: 8, color: "#555" }}>Phone: {item.phone_number}</p>

      {item.description ? <p style={{ marginTop: 16 }}>{item.description}</p> : null}

      {Array.isArray((item as any).images) && (item as any).images.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Images</div>
          <ul>
            {(item as any).images.map((img: any) => (
              <li key={img.id}>{img.image}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
