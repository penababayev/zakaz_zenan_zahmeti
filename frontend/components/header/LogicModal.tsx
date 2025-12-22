"use client";

import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://34.30.221.231:8001";

  const LOGIN_URL = `${API_BASE}/auth/login`;

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username_or_email: emailOrUsername, // ✅ Swagger ile aynı
          password: password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data?.detail
            ? typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail)
            : `Giriş başarısız (${response.status})`;
        setError(message);
        return;
      }

      // ✅ token kaydet
      localStorage.setItem("accessToken", data?.access_token);
      localStorage.setItem("tokenType", data?.token_type ?? "bearer");

      // ✅ Header güncellensin
      window.dispatchEvent(new Event("auth-changed"));

      onLoginSuccess();
      onClose();
    } catch {
      setError("Sunucuya bağlanılamadı. Ağ bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">🔐 Giriş Yap</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="E-posta veya Kullanıcı Adı"
            className="w-full p-3 mb-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />

          {error && (
            <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
          )}

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
            >
              Kapat
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "..." : "Giriş Yap"}
            </button>
          </div>
        </form>

        <p className="mt-3 text-xs text-gray-500 break-all">
          API: {LOGIN_URL}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
