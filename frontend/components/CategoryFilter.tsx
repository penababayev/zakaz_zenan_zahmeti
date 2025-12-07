// app/products/ProductsWithFilter.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/constants/types";
import Link from "next/link";


type Props = {
  products: Product[];
};

// Backend'teki media ayarına göre:
function getImageUrl(path: string) {
  return `http://34.10.166.242:8001/media/${path}`;
}

export default function ProductsWithFilter({ products }: Props) {
  // === MOBIL / DESKTOP AYIRIMI ===
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // === KATEGORI SECIMI (BIRDEN FAZLA) ===
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Benzersiz kategori listesi
  const categories = useMemo(() => {
    const map = new Map<number, string>();

    products.forEach((p) => {
      if (!map.has(p.category_id)) {
        map.set(p.category_id, p.category_name);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // Kategori checkbox değişimi (multi-select)
  const handleCategoryChange = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId) // seçiliyse kaldır
        : [...prev, catId] // seçili değilse ekle
    );
  };

  // Filtrelenmiş ürünler
  const filteredProducts =
    selectedCategoryIds.length === 0
      ? products // hiç kategori seçilmemiş → hepsi
      : products.filter((p) => selectedCategoryIds.includes(p.category_id));

  // Eski fiyat için basit hesap (örn: %10 daha pahalı)
  const getOldPrice = (price: string) => {
    const p = parseFloat(price);
    if (isNaN(p)) return "";
    return (p * 1.1).toFixed(2);
  };

  return (
    <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "1rem" }}>
      {/* Üst başlık */}
      <h1
        style={{
          fontSize: isMobile ? "1.5rem" : "1.9rem",
          fontWeight: 700,
          marginBottom: isMobile ? "1.2rem" : "2rem",
        }}
      >
        GET THE PRODUCTS AS YOUR NEEDS
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1.5rem" : "2.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* SOL: Kategori filtresi (mobilde üstte tam genişlik) */}
        <aside
          style={{
            flex: isMobile ? "1 1 auto" : "0 0 260px",
          }}
        >
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Product Categories
          </h2>

          <hr style={{ margin: "0 0 1rem 0", borderColor: "#e5e5e5" }} />

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {categories.map((cat) => {
              const checked = selectedCategoryIds.includes(cat.id);

              return (
                <li
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCategoryChange(cat.id)}
                    style={{
                      width: 16,
                      height: 16,
                      cursor: "pointer",
                    }}
                  />
                  <label
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </label>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* SAĞ: Ürün kartları (mobilde alt tarafta, tek sütun) */}
        <section style={{ flex: 1 }}>
          {filteredProducts.length === 0 && (
            <p>Bu kategori için ürün bulunamadı.</p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredProducts.map((product) => {
              const oldPrice = getOldPrice(product.price);

              return (
              <Link
                key={product.id}                          // 🔑 her kart için unique key
                href={`/shop/${product.id}`}             // 🔗 DİNAMİK URL: /shop/1, /shop/2...
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 16,
                    padding: "1.25rem",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    maxWidth: isMobile ? "100%" : 320,
                    width: "100%",
                    margin: isMobile ? "0 auto" : undefined,
                    cursor: "pointer",
                  }}
                >
                  {/* Ürün görseli */}
                  <div
                    style={{
                      width: "100%",
                      height: 190,
                      borderRadius: 16,
                      backgroundColor: "#f7f8fa",
                      marginBottom: "1rem",
                      overflow: "hidden",
                    }}
                  >
                    {product.images?.[0] && (
                      <img
                        src={getImageUrl(product.images[0].image)}
                        alt={product.images[0].alt || product.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: "0.72rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {product.category_name}
                  </p>

                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      margin: "0 0 0.5rem 0",
                      color: "#111827",
                    }}
                  >
                    {product.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#111827",
                      }}
                    >
                      {product.price} {product.currency}
                    </span>
                    {oldPrice && (
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#9ca3af",
                          textDecoration: "line-through",
                        }}
                      >
                        {oldPrice} {product.currency}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.65rem 1rem",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "#047857",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>🛒</span>
                    <span>Add to Cart</span>
                  </button>
                </article>
              </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
