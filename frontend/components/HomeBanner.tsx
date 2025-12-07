import React from 'react'
import { Title } from './ui/text'
import Link from 'next/link'
import Image from 'next/image'
import { banner } from '@/images'

const HomeBanner = () => {
  return (
    <div className="bg-shop_light_pink rounded-lg px-6 md:px-10 lg:px-24 py-10 md:py-0">
      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-10">

        {/* SOL BLOK */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* SALE BADGE */}
          <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-full
                          text-xs md:text-sm font-semibold
                          bg-shop_btn_dark_green/10 text-shop_btn_dark_green
                          border border-shop_btn_dark_green/20">
            50% OFF <span className="text-black/80">Summer Super Sale</span>
          </div>

          <Title className="mb-1 leading-tight">
            Döredijilik bilen müşderiniň duşuşýan ýeri<br/>
            El işi, moda we sungat bir ýerde
          </Title>

          <div className="flex flex-row gap-4 pt-2">
            <Link href="/shop"
              className="bg-shop_btn_dark_green/90 text-white/90 font-semibold py-2 px-5 rounded-md text-sm hover:text-white hover:bg-shop_btn_dark_green hoverEffect">
              Satyn Al
            </Link>
            <Link href="/advertisement"
              className="bg-white text-black font-semibold py-2 px-5 rounded-md text-sm hoverEffect">
              Mahabat Goş
            </Link>
          </div>
        </div>

        {/* SAĞ GÖRSEL */}
        <div className="flex-1 flex md:justify-end pl-4 md:pl-10">
          <Image
            src={banner}
            alt="banner-1"
            className="hidden md:inline-flex w-[580px] md:w-[620px] lg:w-[660px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default HomeBanner
