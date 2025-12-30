"use client";

import React, { useState } from "react";
import type { SellerProduct, SellerProductStatus } from "@/lib/sellerProductsApi";
import { replaceSellerProduct } from "@/lib/sellerProductsApi";

type Props = {
  product: SellerProduct;
  onUpdated?: (p: SellerProduct) => void;
  onClose?: () => void;
};

const STATUS_OPTIONS: Array<{ label: string; value: SellerProductStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Paused", value: "paused" },
];

const CURRENCIES = ["EUR", "USD", "TRY"] as const;

export default function ReplaceProductForm({ product, onUpdated, onClose }: Props) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState<number>(Number(product.price) || 0);
  const [currency, setCurrency] = useState(product.currency || "EUR");
  const [status, setStatus] = useState<SellerProductStatus>(
    (product as any).status ?? "draft"
  );
  const [isHandmade, setIsHandmade] = useState<boolean>(
    (product as any).is_handmade ?? true
  );

  const [description, setDescription] = useState<string>(product.description ?? "");
  const [categoryId, setCategoryId] = useState<number>(product.category_id ?? 0);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!title.trim()) return setErr("Title is required.");
    if (price < 0) return setErr("Price must be >= 0.");

    const payload = {
      title: title.trim(),
      price: Number(price) || 0,
      currency,
      status,
      is_handmade: isHandmade,
      // opsiyoneller:
      description: description ?? "",
      category_id: Number.isFinite(categoryId) ? Number(categoryId) : 0,
    };

    // ✅ UI optimistik (backend yoksa bile güncellensin)
    const optimistic: SellerProduct = {
      ...product,
      title: payload.title,
      price: String(payload.price),
      currency: payload.currency,
      description: payload.description ?? "",
      category_id: payload.category_id ?? product.category_id,
    };
    onUpdated?.(optimistic);

    try {
      setSaving(true);
      const updated = await replaceSellerProduct(product.id, payload);
      onUpdated?.(updated);
      setOk("Product updated (PUT) ✅");
      onClose?.();
    } catch {
      // backend yoksa optimistik kaldı
      setOk("Backend not ready — updated as mock ✅");
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">Full Update (PUT)</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50"
          >
            Close
          </button>
        )}
      </div>

      {err && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}
      {ok && (
        <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {ok}
        </div>
      )}

      <form onSubmit={submit} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Title *</label>
          <input
            className="h-10 w-full rounded-md border px-3 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Price *</label>
            <input
              type="number"
              className="h-10 w-full rounded-md border px-3 text-sm"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Currency *</label>
            <select
              className="h-10 w-full rounded-md border px-3 text-sm"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Status *</label>
            <select
              className="h-10 w-full rounded-md border px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Category ID (optional)
            </label>
            <input
              type="number"
              className="h-10 w-full rounded-md border px-3 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="flex items-end gap-2">
            <input
              id="is_handmade_put"
              type="checkbox"
              checked={isHandmade}
              onChange={(e) => setIsHandmade(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_handmade_put" className="text-sm font-semibold text-slate-600">
              is_handmade *
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Description (optional)
          </label>
          <textarea
            className="min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="h-10 w-full rounded-md bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save (PUT replace)"}
        </button>
      </form>
    </div>
  );
}
