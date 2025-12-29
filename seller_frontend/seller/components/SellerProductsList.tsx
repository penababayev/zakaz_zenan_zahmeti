"use client";

import React, { useEffect, useMemo, useState } from "react";
import type {
  SellerProduct,
  SellerProductStatus,
  PatchSellerProductPayload,
} from "@/lib/sellerProductsApi";
import {
  getSellerProducts,
  patchSellerProductMinimal,
} from "@/lib/sellerProductsApi";

import ReplaceProductForm from "@/components/ReplaceProductForm"; // path'ini projene göre düzelt

const STATUS_FILTERS: Array<{ label: string; value: SellerProductStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Paused", value: "paused" }, // swagger örneği
];

function formatMoney(priceStr: string, currency: string) {
  const n = Number(priceStr);
  if (Number.isFinite(n)) return `${n.toFixed(2)} ${currency}`;
  return `${priceStr} ${currency}`;
}

export default function SellerProductsList() {
  const [items, setItems] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [statusIn, setStatusIn] = useState<SellerProductStatus[]>([]);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  // PATCH edit UI
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<SellerProductStatus>("draft");
  const [saving, setSaving] = useState(false);

  // ✅ PUT UI
  const [putProduct, setPutProduct] = useState<SellerProduct | null>(null);

  const canPrev = offset > 0;
  const canNext = items.length === limit;

  const params = useMemo(
    () => ({
      q: q.trim() || undefined,
      status_in: statusIn.length ? statusIn : undefined,
      limit,
      offset,
    }),
    [q, statusIn, limit, offset]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getSellerProducts(params);
        setItems(data);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load products");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  const toggleStatusFilter = (v: SellerProductStatus) => {
    setOffset(0);
    setStatusIn((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const startEdit = (p: SellerProduct) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditPrice(Number(p.price) || 0);
    setEditStatus((p as any).status ?? "draft");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPrice(0);
    setEditStatus("draft");
  };

  const saveEdit = async () => {
    if (editingId == null) return;

    const payload: PatchSellerProductPayload = {
      title: editTitle.trim() || undefined,
      price: Number(editPrice),
      status: editStatus,
    };

    // UI optimistik güncelle
    setItems((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: payload.title ?? p.title,
              price: payload.price != null ? String(payload.price) : p.price,
            }
          : p
      )
    );

    try {
      setSaving(true);
      const updated = await patchSellerProductMinimal(editingId, payload);
      setItems((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      cancelEdit();
    } catch {
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-bold">My Products</h2>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            className="h-10 w-full rounded-md border px-3 text-sm md:w-[260px]"
            placeholder="Search in title..."
            value={q}
            onChange={(e) => {
              setOffset(0);
              setQ(e.target.value);
            }}
          />

          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={String(limit)}
            onChange={(e) => {
              setOffset(0);
              setLimit(Number(e.target.value));
            }}
          >
            <option value="10">Limit 10</option>
            <option value="25">Limit 25</option>
            <option value="50">Limit 50</option>
            <option value="100">Limit 100</option>
          </select>
        </div>
      </div>

      {/* Status filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const active = statusIn.includes(s.value);
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleStatusFilter(s.value)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                active
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {err && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* List */}
      <div className="mt-5 space-y-3">
        {items.map((p) => {
          const isEditing = editingId === p.id;

          return (
            <div key={p.id} className="rounded-md border p-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-md border bg-slate-50">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No img
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-black/60">
                      {p.category_name} • {p.shop_name} • {p.location}
                    </div>
                    <div className="text-xs text-black/60">
                      {formatMoney(p.price, p.currency)} • Stock:{" "}
                      {p.stock_quantity}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* ✅ PUT button */}
                  <button
                    type="button"
                    onClick={() => {
                      // PATCH edit açıksa kapat
                      cancelEdit();
                      setPutProduct(p);
                    }}
                    className="h-9 rounded-md border px-3 text-sm hover:bg-slate-50"
                  >
                    Full Edit (PUT)
                  </button>

                  {/* PATCH buttons */}
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        // PUT açıksa kapat
                        setPutProduct(null);
                        startEdit(p);
                      }}
                      className="h-9 rounded-md border px-3 text-sm hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="h-9 rounded-md border px-3 text-sm hover:bg-slate-50"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="h-9 rounded-md bg-orange-500 px-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* PATCH Edit Panel */}
              {isEditing && (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Title
                    </label>
                    <input
                      className="h-10 w-full rounded-md border px-3 text-sm"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Price
                    </label>
                    <input
                      type="number"
                      className="h-10 w-full rounded-md border px-3 text-sm"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Status
                    </label>
                    <select
                      className="h-10 w-full rounded-md border px-3 text-sm"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="draft">draft</option>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="paused">paused</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!items.length && !err && (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
            No products found.
          </div>
        )}
      </div>

      {/* ✅ PUT Form (listin altında) */}
      {putProduct && (
        <div className="mt-6 rounded-lg border bg-slate-50 p-4">
          <ReplaceProductForm
            product={putProduct}
            onUpdated={(u) => {
              setItems((prev) =>
                prev.map((x) => (x.id === u.id ? u : x))
              );
            }}
            onClose={() => setPutProduct(null)}
          />
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setOffset((o) => Math.max(0, o - limit))}
          className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-sm text-slate-600">
          Offset: <span className="font-semibold">{offset}</span> • Limit:{" "}
          <span className="font-semibold">{limit}</span>
        </div>

        <button
          type="button"
          disabled={!canNext}
          onClick={() => setOffset((o) => o + limit)}
          className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
