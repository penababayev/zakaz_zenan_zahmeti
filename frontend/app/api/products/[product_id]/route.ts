import { NextResponse } from "next/server";
import { products } from "../../_mockProduct";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ product_id: string }> } // ✅ Promise
) {
  const { product_id } = await ctx.params;         // ✅ await
  const id = Number(product_id);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ detail: "Invalid product_id" }, { status: 400 });
  }

  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ detail: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
