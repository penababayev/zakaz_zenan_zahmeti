"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenAuthChoice: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isLoggedIn,
  onLogout,
  onOpenAuthChoice,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // dışarı tıklayınca menüyü kapat
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!isLoggedIn) {
    return (
      <button
        onClick={onOpenAuthChoice}
        className="flex items-center text-white text-sm bg-blue-500 hover:bg-blue-400 transition justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded md:text-base whitespace-nowrap"
      >
        Giriş Yap
      </button>
    );
  }

  return (
    <div className="relative" ref={wrapRef}>
      {/* Admin button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-emerald-700 transition whitespace-nowrap"
      >
        Admin ▾
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/admin");
              router.refresh();
            }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
          >
            Go to admin page
          </button>

          <div className="h-px bg-gray-200" />

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-semibold"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
