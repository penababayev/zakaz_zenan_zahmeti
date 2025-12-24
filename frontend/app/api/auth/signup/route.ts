import { NextResponse } from "next/server";
import { createUser, findUserByEmail, findUserByUsername } from "../../_mockAuthDb";

type SignupBody = {
  email?: string;
  username?: string;
  password?: string; // mock’ta saklamıyoruz
  full_name?: string;
  phone?: string;
  role?: "buyer" | "seller";
};

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as SignupBody;

  const email = (body.email ?? "").trim();
  const username = (body.username ?? "").trim();
  const password = (body.password ?? "").trim();
  const full_name = (body.full_name ?? "").trim() || null;
  const phone = (body.phone ?? "").trim() || null;
  const role = body.role ?? "buyer";

  // --- validation (basit ama yeterli) ---
  if (!email || !username || !password) {
    return NextResponse.json(
      { detail: "email, username ve password zorunlu (mock)." },
      { status: 422 }
    );
  }
  if (!isEmailValid(email)) {
    return NextResponse.json({ detail: "Email formatı geçersiz (mock)." }, { status: 422 });
  }
  if (username.length < 3) {
    return NextResponse.json({ detail: "username en az 3 karakter olmalı (mock)." }, { status: 422 });
  }
  if (password.length < 6) {
    return NextResponse.json({ detail: "password en az 6 karakter olmalı (mock)." }, { status: 422 });
  }
  if (role !== "buyer" && role !== "seller") {
    return NextResponse.json({ detail: "role sadece buyer veya seller olabilir (mock)." }, { status: 422 });
  }

  // --- duplicate checks ---
  if (findUserByEmail(email)) {
    return NextResponse.json({ detail: "Bu email zaten kayıtlı (mock)." }, { status: 409 });
  }
  if (findUserByUsername(username)) {
    return NextResponse.json({ detail: "Bu username zaten kullanımda (mock)." }, { status: 409 });
  }

  // --- create user ---
  const user = createUser({
    email,
    username,
    full_name,
    phone,
    role,
  });

  // İstersen signup sonrası direkt token da döndürebilirsin:
  // ama şimdilik sadece user döndürelim.
  return NextResponse.json(user, { status: 201 });
}
