"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Globe } from "lucide-react";
import Logo from "./Logo";

type Lang = { code: string; label: string };

const LANGS: Lang[] = [
  { code: "en", label: "English" },
  { code: "tr", label: "Türkçe" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
];

export default function SellerTopbar() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(LANGS[0]);

  const currentLabel = useMemo(() => lang.label, [lang]);

  return (
    <header className="w-full bg-slate-800 text-slate-100">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <Logo/>
        </div>

        {/* Right: links */}
        <div className="flex items-center gap-6">
          

          {/* Language dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <Globe className="h-4 w-4 opacity-80" />
              <span>{currentLabel}</span>
              <ChevronDown className="h-4 w-4 opacity-80" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-lg">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // blur kapanmasını engelle
                    onClick={() => {
                      setLang(l);
                      setOpen(false);
                      // burada i18n changeLanguage vs. çağırabilirsin
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-800 ${
                      lang.code === l.code ? "text-white" : "text-slate-200"
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang.code === l.code && <span className="text-slate-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
