"use client";

import React, { useEffect, useState } from "react";
import type { Product, ProductCreate } from "@/lib/sellerApi";
import { createProduct, getMyProducts, updateStock } from "@/lib/sellerApi";
import { mockProducts } from "@/lib/mockSellerData";

export default function MyProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProducts();
        setItems(data);
      } catch {
        // backend yoksa mock
        setItems(mockProducts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onCreate = async () => {
    const tempId = Date.now();

    // ✅ UI için tam Product oluştur (is_active kesin boolean)
    const tempProduct: Product = {
      id: tempId,
      name: (newName || "New Product").trim(),
      description: undefined,
      price: Number(newPrice) || 0,
      stock_quantity: Number(newStock) || 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // UI'ye hemen ekle
    setItems((prev) => [tempProduct, ...prev]);

    // input reset
    setNewName("");
    setNewPrice(0);
    setNewStock(0);

    // ✅ API payload (backend için)
    const payload: ProductCreate = {
      name: tempProduct.name,
      description: tempProduct.description,
      price: tempProduct.price,
      stock_quantity: tempProduct.stock_quantity,
      is_active: tempProduct.is_active,
    };

    try {
      const created = await createProduct(payload);
      // temp ürünü gerçek ürünle değiştir
      setItems((prev) => prev.map((p) => (p.id === tempId ? created : p)));
    } catch {
      // backend yoksa temp ürün kalsın
    }
  };

  const changeStock = async (id: number, next: number) => {
    const safeNext = Number.isFinite(next) ? next : 0;

    // UI hızlı güncelle
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock_quantity: safeNext } : p))
    );

    try {
      await updateStock(id, safeNext);
    } catch {
      // backend yoksa sessiz geç
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">My Products</h2>
      </div>

      {/* Create Product */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          className="h-10 rounded-md border px-3 text-sm"
          placeholder="Product name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="h-10 rounded-md border px-3 text-sm"
          placeholder="Price"
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
        />
        <input
          className="h-10 rounded-md border px-3 text-sm"
          placeholder="Stock"
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(Number(e.target.value))}
        />
        <button
          type="button"
          onClick={onCreate}
          className="h-10 rounded-md bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Create
        </button>
      </div>

      {/* List */}
      <div className="mt-5 space-y-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-black/60">
                Price: ${p.price} • Active: {p.is_active ? "Yes" : "No"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-black/60">Stock</span>
              <input
                type="number"
                className="h-9 w-20 rounded-md border px-2 text-sm"
                value={p.stock_quantity}
                onChange={(e) => changeStock(p.id, Number(e.target.value))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
