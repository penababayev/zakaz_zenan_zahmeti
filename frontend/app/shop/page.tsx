// app/products/page.tsx
import { Product } from "@/constants/types";
import ProductsWithFilter from "@/components/CategoryFilter";

const API_URL = "http://34.10.166.242:8001/products";

// Bu sayfanın build sırasında pre-render edilmesini engeller.
// Böylece API'ye erişilemediğinde Vercel build'i çökmez.
export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 }, 
    });

    if (!res.ok) {
      console.error(
        "SERVER LOG >>> products fetch failed:",
        res.status,
        await res.text()
      );
      return []; 
    }

    return res.json();
  } catch (err) {
    console.error("SERVER LOG >>> products fetch error:", err);
    return []; // Network hatasında da boş array döndür
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsWithFilter products={products} />;
}
