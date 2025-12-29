import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import SellerLoginPanel from "./LoginPanel";

const HomeBanner = () => {
  return (
    <div className="bg-shop_light_pink rounded-lg px-6 md:px-10 lg:px-24 py-12">
      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-12">

        {/* SOL BLOK: Seller Login Panel */}
        <div className="w-full md:w-[460px] flex items-center justify-center md:justify-start">
          <SellerLoginPanel />
        </div>

        {/* SAĞ BLOK: Trendyol Partner tarzı metin */}
        <div className="flex-1 flex flex-col justify-center gap-5">
          <Title className="leading-tight">
            Döredijilik bilen söwda<br />
            bir ýerde başlaýar
          </Title>

          <p className="max-w-xl text-base md:text-lg text-black/70">
            Satyjylara ýörite döredilen platforma bilen öz dükanyňy dolandyryp,
            önümleriňi giň müşderi köpçüligine ýetiriň.
          </p>

          <div className="flex flex-row gap-4 pt-3">
            <Link
              href="/register"
              className="bg-shop_btn_dark_green text-white font-semibold
                         py-2.5 px-6 rounded-md text-sm
                         hover:bg-shop_btn_dark_green/90 hoverEffect"
            >
              Satyjy bol
            </Link>

            <Link
              href="/about"
              className="bg-white text-black font-semibold
                         py-2.5 px-6 rounded-md text-sm hoverEffect"
            >
              Giňişleýin maglumat
            </Link>
          </div>

          {/* Güven satırı (Trendyol hissi) */}
          <p className="pt-2 text-sm text-black/50">
            Growing marketplace built for independent sellers.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HomeBanner;
