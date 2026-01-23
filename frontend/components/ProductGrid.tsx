"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import type { Product } from "@/constants/types";
import { getProducts } from "@/lib/api";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr(null);
      try {
        // ✅ FastAPI ürünlerini çek
        const data = await getProducts({ limit: 24, offset: 0 });

        // Eğer tab'a göre filtrelemek istersen burada yaparsın
        // Şimdilik hepsini gösterelim
        setProducts(data);
      } catch (e: any) {
        console.error("Product fetching Error:", e);
        setErr(e?.message ?? "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

  return (
    <div>
      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-gray-100 w-full mt-10">
          <div className="space-x-2 flex items-center text-green-600">
            <Loader2 className="w-5 h-6 animate-spin" />
            <span>Product is loading ... </span>
          </div>
        </div>
      ) : products.length ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-lg border p-4 space-y-2">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">
                {p.price} {p.currency} • stok: {p.stock_quantity}
              </div>

              {/* ✅ EN ÖNEMLİ SATIR: doğru id */}
              <Link href={`/products/${p.id}`} className="text-sm underline">
                View detail
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          {err ? <div className="text-red-600 text-sm">{err}</div> : null}
          <NoProductAvailable selectedTab={selectedTab} />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
