"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type SignupBody = {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  role?: "buyer" | "seller";
};

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupBody>({
    email: "",
    username: "",
    password: "",
    full_name: "",
    phone: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onChange = (key: keyof SignupBody, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
          full_name: form.full_name || undefined,
          phone: form.phone || undefined,
          role: form.role ?? "buyer",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.detail || "Signup failed");
        return;
      }

      // ✅ Token yaz (mock ise token yoksa bile UI için mock_token yazıyoruz)
      const accessToken =
        data?.access_token || data?.accessToken || data?.token || null;
      const tokenType = data?.token_type || data?.tokenType || "Bearer";

      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", accessToken ?? "mock_token");
        window.localStorage.setItem("tokenType", tokenType);

        // (opsiyonel) eski key'leri de yaz
        window.localStorage.setItem("access_token", accessToken ?? "mock_token");
        window.localStorage.setItem("token_type", tokenType);
      }

      // ✅ Header güncellensin
      window.dispatchEvent(new Event("auth-changed"));

      setSuccessMsg("Kayıt başarılı! Ana sayfaya yönlendiriliyorsun...");

      // ✅ Home'a geç
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Sign Up</h1>

      {error && (
        <div className="mb-3 p-3 rounded border border-red-300 text-red-700">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-3 p-3 rounded border border-green-300 text-green-700">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Username"
          value={form.username}
          onChange={(e) => onChange("username", e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Password (min 6)"
          type="password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Full name (optional)"
          value={form.full_name ?? ""}
          onChange={(e) => onChange("full_name", e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Phone (optional)"
          value={form.phone ?? ""}
          onChange={(e) => onChange("phone", e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={form.role}
          onChange={(e) => onChange("role", e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        Zaten hesabın var mı?{" "}
        <button
          className="underline"
          onClick={() => router.push("/")}
          type="button"
        >
          Ana sayfa
        </button>
      </div>
    </div>
  );
}
