import { NextResponse } from "next/server";
import { products, Product } from "../_mockData";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").toLowerCase();
  const category_id = searchParams.get("category_id");
  const is_featured = searchParams.get("is_featured");
  const is_top_product = searchParams.get("is_top_product");

  let data: Product[] = products.filter((p) => p.is_active);

  // 🔍 search (name + description)
  if (q) {
    data = data.filter(
      (p) =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_ro.toLowerCase().includes(q) ||
        (p.description_en ?? "").toLowerCase().includes(q) ||
        (p.description_ro ?? "").toLowerCase().includes(q)
    );
  }

  // 🧩 category filter
  if (category_id) {
    data = data.filter(
      (p) => p.category_id === Number(category_id)
    );
  }

  // ⭐ featured
  if (is_featured === "true") {
    data = data.filter((p) => p.is_featured);
  }

  // 🔥 top product
  if (is_top_product === "true") {
    data = data.filter((p) => p.is_top_product);
  }

  return NextResponse.json({
    count: data.length,
    results: data,
  });
}
