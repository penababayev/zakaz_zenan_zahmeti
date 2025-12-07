// app/shop/[id]/page.tsx
import { Product } from "@/constants/types";

const API_URL = "http://34.10.166.242:8001/products";

function getImg(path: string) {
  return `http://34.10.166.242:8001/media/${path}`;
}

type ProductDetail = Product & {
  status: string;
  is_handmade: boolean;
  created_at: string;
  seller: {
    id: number;
    username: string;
  };
  is_favorited: boolean;
};

async function getProduct(id: string): Promise<ProductDetail | null> {
  // id'yi sayıya çevir
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    console.error("SERVER LOG >>> Invalid product id:", id);
    return null;
  }

  const url = `${API_URL}/${numericId}`;
  console.log("SERVER LOG >>> Fetching product from:", url);

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.error(
        "SERVER LOG >>> Product fetch failed",
        res.status,
        "url:",
        url,
        "body:",
        await res.text()
      );
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("SERVER LOG >>> Product fetch error", err);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;   // 🔴 Next 16: params bir Promise
}) {
  // Promise'i aç
  const { id } = await params;
  console.log("SERVER LOG >>> Route params id:", id);

  const product = await getProduct(id);

  if (!product) {
    return (
      <main
        style={{
          maxWidth: 800,
          margin: "2rem auto",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.7rem", marginBottom: "1rem" }}>
          Ürün bulunamadı
        </h1>
        <p style={{ color: "#555" }}>
          İstediğiniz ürün şu anda mevcut değil veya bir hata oluştu.
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        {/* Sol: Resim */}
        <div
          style={{
            flex: "1 1 320px",
            borderRadius: 16,
            overflow: "hidden",
            background: "#f7f8fa",
            border: "1px solid #eee",
          }}
        >
          {product.images?.[0] && (
            <img
              src={getImg(product.images[0].image)}
              alt={product.title}
              style={{
                width: "100%",
                height: 450,
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* Sağ: Detaylar */}
        <div style={{ flex: "1 1 320px" }}>
          <p
            style={{
              textTransform: "uppercase",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              color: "#6b7280",
              marginBottom: "0.3rem",
            }}
          >
            {product.category_name}
          </p>

          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            {product.title}
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            {product.price} {product.currency}
          </p>

          <p style={{ marginBottom: "1.5rem", color: "#444" }}>
            {product.description}
          </p>

          <div style={{ marginBottom: "1.2rem", fontSize: "0.95rem" }}>
            <p>
              <strong>Shop:</strong> {product.shop_name}
            </p>
            <p>
              <strong>Location:</strong> {product.location}
            </p>
            <p>
              <strong>Seller:</strong> {product.seller.username}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${product.phone_number}`}>
                {product.phone_number}
              </a>
            </p>
          </div>

          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#047857",
              borderRadius: 8,
              color: "white",
              fontSize: "1rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
