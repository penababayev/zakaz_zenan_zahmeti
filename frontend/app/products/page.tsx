"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/constants/types";
import { getProducts } from "@/lib/api";

export default function ProductsPage() {
  // filtre state
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [limit, setLimit] = useState<string>("24");
  const [offset, setOffset] = useState<string>("0");

  // data state
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => {
    const toNum = (v: string) => (v.trim() === "" ? undefined : Number(v));
    return {
      q: q.trim() || undefined,
      category_id: categoryId.trim() === "" ? undefined : Number(categoryId),
      price_min: toNum(priceMin),
      price_max: toNum(priceMax),
      limit: toNum(limit) ?? 24,
      offset: toNum(offset) ?? 0,
    };
  }, [q, categoryId, priceMin, priceMax, limit, offset]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getProducts(query);
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ilk açılışta yükle
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>

      {/* Filtreler */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="space-y-1">
            <div className="text-sm text-gray-600">q (title search)</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
              placeholder="search..."
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">category_id</div>
            <input
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
              placeholder="e.g. 3"
              inputMode="numeric"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">limit</div>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
              placeholder="24"
              inputMode="numeric"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">price_min</div>
            <input
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
              placeholder="e.g. 10"
              inputMode="decimal"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">price_max</div>
            <input
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
              placeholder="e.g. 100"
              inputMode="decimal"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-600">offset</div>
            <input
              value={offset}
              onChange={(e) => setOffset(e.target.value)}
              className="w-full h-10 rounded-md border px-3"
              placeholder="0"
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="h-10 rounded-md bg-black text-white px-4"
            disabled={loading}
          >
            {loading ? "Loading..." : "Apply"}
          </button>

          <button
            onClick={() => {
              setQ("");
              setCategoryId("");
              setPriceMin("");
              setPriceMax("");
              setLimit("24");
              setOffset("0");
            }}
            className="h-10 rounded-md border px-4"
            disabled={loading}
          >
            Reset
          </button>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="rounded-lg border p-4 space-y-2">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">
              {p.price} {p.currency} • stok: {p.stock_quantity}
            </div>
            <div className="text-sm text-gray-600">
              {p.category_name} (#{p.category_id})
            </div>

            <div className="flex items-center justify-between pt-2">
              {/* ✅ senin istediğin link */}
              <Link href={`/products/${p.id}`} className="text-sm underline">
                View detail
              </Link>

              <span className="text-xs text-gray-500">{p.location}</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && !err && (
        <div className="text-sm text-gray-600">No products found.</div>
      )}
    </div>
  );
}
