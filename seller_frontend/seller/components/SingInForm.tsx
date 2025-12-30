"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Backend hazır değilken true kalsın.
// Backend hazır olunca false yap.
const DEV_MOCK_AUTH = true;

// ---------------- Types ----------------
type MainTab = "login" | "register";

type TokenResponse = {
  access_token: string;
  token_type: "bearer" | string;
};

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

type LoginPayload = {
  username_or_email: string;
  password: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001";

// ---------------- Helpers ----------------
const saveToken = (data: TokenResponse) => {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("token_type", data.token_type);
};

const mockToken = (type: "login" | "signup"): TokenResponse => ({
  access_token: `mock-${type}-${Date.now()}`,
  token_type: "bearer",
});

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

async function signupApi(payload: SignupPayload): Promise<TokenResponse> {
  // Gerçek backend varsa:
  return postJson<TokenResponse>("/auth/signup", payload);
}

async function loginApi(payload: LoginPayload): Promise<TokenResponse> {
  // Gerçek backend varsa:
  return postJson<TokenResponse>("/auth/login", payload);
}

export default function SellerSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL tab sync: ?tab=login / ?tab=register
  const tabFromUrl = useMemo(() => {
    const t = (searchParams.get("tab") || "login").toLowerCase();
    return (t === "register" ? "register" : "login") as MainTab;
  }, [searchParams]);

  const [mainTab, setMainTab] = useState<MainTab>(tabFromUrl);

  useEffect(() => setMainTab(tabFromUrl), [tabFromUrl]);

  const switchTab = (tab: MainTab) => {
    setMainTab(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  };

  // ---------------- LOGIN state ----------------
  const [loginId, setLoginId] = useState(""); // username or email
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // ---------------- REGISTER state (Swagger alanları) ----------------
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // ---------------- Handlers ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginId.trim() || !loginPassword) {
      setLoginError("Please enter username/email and password.");
      return;
    }

    try {
      setLoginLoading(true);

      let data: TokenResponse;

      if (DEV_MOCK_AUTH) {
        // ✅ backend yoksa: mock login
        data = mockToken("login");
      } else {
        // ✅ backend varsa: gerçek login
        data = await loginApi({
          username_or_email: loginId.trim(),
          password: loginPassword,
        });
      }

      saveToken(data);
      router.push("/seller");
    } catch (err: any) {
      // Dev modda değilken gerçek hata
      setLoginError("Login failed. " + (err?.message ?? ""));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!email.includes("@")) {
      setRegError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    const payload: SignupPayload = {
      username: username.trim(),
      email: email.trim(),
      password,
      confirm_password: confirmPassword,
      shop_name: shopName.trim(),
      location: location.trim(),
      phone_number: phoneNumber.trim(),
      bio: bio.trim(),
    };

    try {
      setRegLoading(true);

      let data: TokenResponse;

      if (DEV_MOCK_AUTH) {
        // ✅ backend yoksa: mock signup
        data = mockToken("signup");
      } else {
        // ✅ backend varsa: gerçek signup
        data = await signupApi(payload);
      }

      saveToken(data);
      router.push("/seller");
    } catch (err: any) {
      setRegError("Register failed. " + (err?.message ?? ""));
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Dev Mode Banner */}
      {DEV_MOCK_AUTH && (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          DEV MODE: Backend not ready — using mock login/signup
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => switchTab("login")}
          className={`relative pb-3 text-sm font-semibold ${
            mainTab === "login"
              ? "text-orange-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Login
          {mainTab === "login" && (
            <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-orange-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => switchTab("register")}
          className={`relative pb-3 text-sm font-semibold ${
            mainTab === "register"
              ? "text-orange-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Register
          {mainTab === "register" && (
            <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-orange-500" />
          )}
        </button>
      </div>

      {/* ================= LOGIN ================= */}
      {mainTab === "login" && (
        <form className="space-y-4" onSubmit={handleLogin}>
          {loginError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {loginError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Username or Email
            </label>
            <input
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your username or email..."
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter your password..."
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="h-11 w-full rounded-md bg-orange-500 text-sm font-semibold text-white
                       hover:bg-orange-600 disabled:opacity-60"
          >
            {loginLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
      )}

      {/* ================= REGISTER ================= */}
      {mainTab === "register" && (
        <form className="space-y-4" onSubmit={handleRegister}>
          {regError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {regError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Shop name
            </label>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="My Shop"
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mary welaýat"
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Phone number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+993..."
                inputMode="tel"
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your shop..."
              className="min-h-[96px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="******"
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={regLoading}
            className="mt-2 h-11 w-full rounded-md bg-orange-500 text-sm font-semibold text-white
                       hover:bg-orange-600 disabled:opacity-60"
          >
            {regLoading ? "Creating..." : "Create seller account"}
          </button>
        </form>
      )}
    </div>
  );
}
