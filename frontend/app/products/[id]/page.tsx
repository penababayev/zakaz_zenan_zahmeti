import Image from "next/image";
import type { Product } from "@/constants/types";
import { getProductDetail } from "@/lib/api";

export default async function ProductDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params; // ✅ Next.js params warning fix
  const product: Product = await getProductDetail(id);

  // Görsel URL'leri bazen relative gelebilir; güvenli hale getirelim:
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8001/";

  const normalizeImg = (src: string) => {
    if (!src) return src;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    // "/media/..." gibi gelirse base ekle
    if (src.startsWith("/")) return `${API_BASE}${src}`;
    return `${API_BASE}/${src}`;
  };

  const images = (product.images ?? []).map(normalizeImg);
  const firstImg = images[0];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <div className="text-sm text-gray-600">
            {product.category_name} • {product.location}
          </div>
          <div className="text-sm text-gray-600">
            Seller: <span className="font-medium">{product.seller?.username}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold">
            {product.price} {product.currency}
          </div>
          <div className="text-sm text-gray-600">
            Stock: {product.stock_quantity}
          </div>
        </div>
      </div>

      {/* Image */}
      {firstImg ? (
        <div className="relative w-full h-[320px] rounded-lg overflow-hidden border">
          <Image
            src={firstImg}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      ) : (
        <div className="h-[240px] rounded-lg border flex items-center justify-center text-sm text-gray-500">
          No image
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.slice(0, 10).map((src, i) => (
            <div
              key={src + i}
              className="relative w-20 h-20 rounded-md overflow-hidden border flex-none"
              title={`Image ${i + 1}`}
            >
              <Image src={src} alt={`thumb-${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="rounded-lg border p-4 space-y-2">
        <div className="text-sm text-gray-600">Description</div>
        <p className="text-sm whitespace-pre-wrap">{product.description}</p>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 space-y-1">
          <div className="text-sm text-gray-600">Shop</div>
          <div className="text-sm font-medium">{product.shop_name}</div>
          <div className="text-sm text-gray-600">{product.phone_number}</div>
        </div>

        <div className="rounded-lg border p-4 space-y-1">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-sm font-medium">{product.status}</div>
          <div className="text-sm text-gray-600">
            Handmade: {product.is_handmade ? "Yes" : "No"}
          </div>
        </div>

        <div className="rounded-lg border p-4 space-y-1">
          <div className="text-sm text-gray-600">Created</div>
          <div className="text-sm font-medium">
            {new Date(product.created_at).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Favorited: {product.is_favorited ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
}
