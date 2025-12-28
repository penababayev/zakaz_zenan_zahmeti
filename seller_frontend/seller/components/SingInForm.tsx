"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "email" | "phone";

export default function SellerSignInForm() {
  const [tab, setTab] = useState<Tab>("email");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const identityLabel = tab === "email" ? "Email address" : "Phone number";
  const identityPlaceholder =
    tab === "email" ? "Enter your email address..." : "Enter your phone number...";
  const buttonText = loading ? "Signing in..." : "Sign in";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Demo loading (API bağlayınca burayı değiştirirsin)
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    alert("Demo login ✓ (API bağlanmadı)");
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("email")}
          className={[
            "py-3 text-sm font-semibold",
            tab === "email"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          Email address
        </button>

        <button
          type="button"
          onClick={() => setTab("phone")}
          className={[
            "py-3 text-sm font-semibold flex items-center gap-2",
            tab === "phone"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          Phone number
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-600">
            New
          </span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="pt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {identityLabel}
          </label>
          <input
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder={identityPlaceholder}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none
                       focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="Enter your password..."
              className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm outline-none
                         focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* remember + forgot */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-orange-500"
            />
            Remember me
          </label>

          <Link href="#" className="text-sm text-orange-500 hover:underline">
            Forgot password
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-orange-300 hover:bg-orange-400 text-white font-semibold
                     py-3 text-sm transition disabled:opacity-60"
        >
          {buttonText}
        </button>

        {/* Help */}
        <div className="pt-2 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:underline"
          >
            <span className="text-base">🎓</span> How can I log in?
          </Link>
        </div>

        {/* Recaptcha note */}
        <p className="pt-3 text-[11px] text-slate-500 leading-relaxed">
          This site is protected by reCAPTCHA and the Google{" "}
          <Link href="#" className="underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          apply.
        </p>
      </form>
    </div>
  );
}
