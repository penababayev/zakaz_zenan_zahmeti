"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type SignupPayload = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  shop_name: string;
  location: string;
  phone_number: string;
  bio: string;
};

type SignupResponse = {
  access_token: string;
  token_type: "bearer" | string;
};

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupPayload>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    shop_name: "",
    location: "",
    phone_number: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001";

  function onChange<K extends keyof SignupPayload>(
    key: K,
    value: SignupPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError("Password ve confirm_password aynı olmalı.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        const message =
          d?.detail
            ? typeof d.detail === "string"
              ? d.detail
              : JSON.stringify(d.detail)
            : `Signup failed (${res.status})`;
        throw new Error(message);
      }

      const data = (await res.json()) as SignupResponse;

      // ✅ token kaydet
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("tokenType", data.token_type ?? "bearer");

      // ✅ signup bilgilerini sakla
      localStorage.setItem(
        "adminProfile",
        JSON.stringify({
          username: form.username,
          email: form.email,
          shop_name: form.shop_name,
          location: form.location,
          phone_number: form.phone_number,
          bio: form.bio,
        })
      );

      // ✅ Header'ı haberdar et
      window.dispatchEvent(new Event("auth-changed"));

      // ✅ main page'e git
      router.replace("/");

      // ✅ garanti fallback (bazen Next navigation takılabiliyor)
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 50);
    } catch (err: any) {
      setError(err?.message ?? "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Signup
      </h1>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="username"
          value={form.username}
          onChange={(e) => onChange("username", e.target.value)}
          required
        />
        <input
          placeholder="email"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
        <input
          placeholder="password"
          type="password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
        />
        <input
          placeholder="confirm_password"
          type="password"
          value={form.confirm_password}
          onChange={(e) => onChange("confirm_password", e.target.value)}
          required
        />

        <input
          placeholder="shop_name"
          value={form.shop_name}
          onChange={(e) => onChange("shop_name", e.target.value)}
          required
        />
        <input
          placeholder="location"
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
          required
        />
        <input
          placeholder="phone_number"
          value={form.phone_number}
          onChange={(e) => onChange("phone_number", e.target.value)}
          required
        />
        <textarea
          placeholder="bio"
          value={form.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          rows={3}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Signing up..." : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: 14, opacity: 0.7, fontSize: 13 }}>
        API: <code>{API_BASE}</code>
      </p>
    </div>
  );
}
