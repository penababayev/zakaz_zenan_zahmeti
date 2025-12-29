"use client";

import React, { useState } from "react";

type MainTab = "login" | "register";

export default function SellerSignInForm() {
  const [mainTab, setMainTab] = useState<MainTab>("login");

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // REGISTER
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [place, setPlace] = useState("");

  return (
    <div className="w-full">
      {/* LOGIN / REGISTER TABS */}
      <div className="mb-4 flex gap-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setMainTab("login")}
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
          onClick={() => setMainTab("register")}
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
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log({
              type: "login",
              email,
              password,
              remember,
            });
          }}
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password..."
                className="h-11 w-full rounded-md border border-slate-300 px-3 pr-10 text-sm outline-none
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-700"
              >
                {/* eye icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-200"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              Forgot password
            </a>
          </div>

          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-md bg-orange-500 text-sm font-semibold text-white
                       hover:bg-orange-600 active:bg-orange-700"
          >
            Log in
          </button>
        </form>
      )}

      {/* ================= REGISTER ================= */}
      {mainTab === "register" && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log({
              type: "register",
              firstName,
              lastName,
              storeName,
              phone: regPhone,
              place,
            });
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                First name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border px-3 text-sm
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600">
                Last name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border px-3 text-sm
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Store name
            </label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border px-3 text-sm
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Phone number
            </label>
            <input
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              inputMode="tel"
              className="mt-1 h-11 w-full rounded-md border px-3 text-sm
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Place
            </label>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border px-3 text-sm
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-md bg-orange-500 text-sm font-semibold text-white
                       hover:bg-orange-600"
          >
            Create seller account
          </button>
        </form>
      )}
    </div>
  );
}
