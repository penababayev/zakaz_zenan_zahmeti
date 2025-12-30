"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type LoginBody = {
  username_or_email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  user?: any;
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginBody>({
    username_or_email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof LoginBody, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          username_or_email: form.username_or_email,
          password: form.password,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as Partial<LoginResponse> & { detail?: string };

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      // ✅ Header’ın kullandığı key’ler:
      localStorage.setItem("accessToken", data.access_token ?? "");
      localStorage.setItem("tokenType", data.token_type ?? "bearer");

      // eski key varsa da yazalım (sen temizliyorsun ama uyum olsun)
      localStorage.setItem("access_token", data.access_token ?? "");
      localStorage.setItem("token_type", data.token_type ?? "bearer");

      // ✅ Header update
      window.dispatchEvent(new Event("auth-changed"));

      // yönlendirme
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
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {/* Mock ipucu */}
      <div className="mb-3 text-sm text-black/70">
        Mock login için şifre: <b>123456</b>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded border border-red-300 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email or username"
          value={form.username_or_email}
          onChange={(e) => onChange("username_or_email", e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-sm flex gap-2">
        <button className="underline" onClick={() => router.push("/signup")} type="button">
          Sign up
        </button>
        <span className="text-black/40">|</span>
        <button className="underline" onClick={() => router.push("/")} type="button">
          Home
        </button>
      </div>
    </div>
  );
}
