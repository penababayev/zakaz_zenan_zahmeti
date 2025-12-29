import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-black/10 bg-white/70">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-4 text-xs text-black/60 md:flex-row">

        {/* LEFT */}
        <div>
          © {new Date().getFullYear()} YourPlatformName. All rights reserved.
        </div>

        {/* CENTER LINKS */}
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-black">
            Privacy Policy
          </Link>
          <span className="text-black/30">|</span>
          <Link href="/terms" className="hover:text-black">
            Terms of Service
          </Link>
          <span className="text-black/30">|</span>
          <Link href="/cookies" className="hover:text-black">
            Cookie Policy
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span className="text-black/50">Language:</span>
          <button className="font-medium hover:text-black">
            English
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
