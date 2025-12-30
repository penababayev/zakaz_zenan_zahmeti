"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenAuthChoice: () => void;
};

export default function AuthButton({
  isLoggedIn,
  onLogout,
  onOpenAuthChoice,
}: Props) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <button
        onClick={onOpenAuthChoice}
        className="border border-black px-3 py-2 rounded"
        type="button"
      >
        Login
      </button>
    );
  }

  // ✅ Logged in: Admin + Logout
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push("/admin")}
        className="bg-black text-white px-3 py-2 rounded"
        type="button"
      >
        Admin
      </button>

      <button
        onClick={onLogout}
        className="border border-black px-3 py-2 rounded"
        type="button"
      >
        Log out
      </button>
    </div>
  );
}
