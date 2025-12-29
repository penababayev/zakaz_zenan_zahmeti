"use client";

import React, { useState } from "react";
import type {
  CreateSellerProductPayload,
  SellerProduct,
  SellerProductStatus,
} from "@/lib/sellerProductsApi";
import { createSellerProduct } from "@/lib/sellerProductsApi";

const CURRENCIES = ["EUR", "USD", "TRY"] as const;

const STATUS_OPTIONS: Array<{ label: string; value: SellerProductStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

type Props = {
  onCreated?: (p: SellerProduct) => void; // listeyi güncellemek istersen
};

export default function CreateProductForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("EUR");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [status, setStatus] = useState<SellerProductStatus>("draft");
  const [isHandmade, setIsHandmade] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setPrice(0);
    setStock(0);
    setDescription("");
    setCurrency("EUR");
    setCategoryId(0);
    setStatus("draft");
    setIsHandmade(true);
  };

  const makeMockCreated = (payload: CreateSellerProductPayload): SellerProduct => {
    return {
      id: Date.now(),
      title: payload.title,
      slug: payload.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, ""),
      price: String(payload.price),
      currency: payload.currency,
      stock_quantity: payload.stock_quantity,
      description: payload.description,
      images: [],
      category_id: payload.category_id,
      category_name: "Mock Category",
      shop_name: "My Shop (Mock)",
      location: "—",
      phone_number: "—",
    };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!title.trim()) {
      setErr("Title is required.");
      return;
    }
    if (price < 0) {
      setErr("Price must be >= 0.");
      return;
    }
    if (stock < 0) {
      setErr("Stock must be >= 0.");
      return;
    }
    if (!Number.isInteger(categoryId) || categoryId < 0) {
      setErr("Category ID must be a valid number.");
      return;
    }

    const payload: CreateSellerProductPayload = {
      title: title.trim(),
      price: Number(price) || 0,
      stock_quantity: Number(stock) || 0,
      description: description ?? "",
      currency,
      category_id: Number(categoryId) || 0,
      status,
      is_handmade: isHandmade,
    };

    try {
      setLoading(true);

      // Gerçek backend
      const created = await createSellerProduct(payload);

      setOk("Product created ✅");
      onCreated?.(created);
      reset();
    } catch (e: any) {
      // Backend yoksa mock olarak “created” gibi yap
      const mockCreated = makeMockCreated(payload);
      setOk("Backend not ready — created as mock ✅");
      onCreated?.(mockCreated);
      reset();
      // İstersen gerçek hatayı da görmek için:
      // setErr(e?.message ?? "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-bold">Create Product</h3>

      {err && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}
      {ok && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {ok}
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Title</label>
          <input
            className="h-11 w-full rounded-md border px-3 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="string"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Price</label>
            <input
              type="number"
              className="h-11 w-full rounded-md border px-3 text-sm"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Stock quantity
            </label>
            <input
              type="number"
              className="h-11 w-full rounded-md border px-3 text-sm"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Currency
            </label>
            <select
              className="h-11 w-full rounded-md border px-3 text-sm"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Description
          </label>
          <textarea
            className="min-h-[96px] w-full rounded-md border px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='""'
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Category ID
            </label>
            <input
              type="number"
              className="h-11 w-full rounded-md border px-3 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Status</label>
            <select
              className="h-11 w-full rounded-md border px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <input
              id="is_handmade"
              type="checkbox"
              checked={isHandmade}
              onChange={(e) => setIsHandmade(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_handmade" className="text-sm font-semibold text-slate-600">
              is_handmade
            </label>
          </div>
        </div>

        <button
          disabled={loading}
          className="h-11 w-full rounded-md bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          type="submit"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
