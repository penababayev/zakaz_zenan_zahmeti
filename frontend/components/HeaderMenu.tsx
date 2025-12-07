"use client"
import { headerData } from '@/constants/data'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils' // yoksa clsx kullan

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-7 text-sm capitalize font-semibold text-lightColor">
      {headerData?.map((item) => {
        const isActive =
          pathname === item?.href ||
          (item?.href !== '/' && pathname?.startsWith(item?.href));

        return (
          <Link
            key={item?.title}
            href={item?.href}
            className={cn(
              "relative group hoverEffect",
              "hover:text-green-700",
              isActive && "text-green-700" // aktif link rengi
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item?.title}

            {/* Sol çizgi */}
            <span
              className={cn(
                "pointer-events-none absolute -bottom-0.5 h-0.5 bg-green-700 hoverEffect",
                // normal başlangıç: merkezde 0 genişlik
                "left-1/2 w-0",
                // hover: sola doğru açılır
                "group-hover:left-0 group-hover:w-1/2",
                // aktif: kalıcı olarak yarım genişlik ve sola yaslı
                isActive && "left-0 w-1/2"
              )}
            />

            {/* Sağ çizgi */}
            <span
              className={cn(
                "pointer-events-none absolute -bottom-0.5 h-0.5 bg-green-700 hoverEffect",
                "right-1/2 w-0",
                "group-hover:right-0 group-hover:w-1/2",
                isActive && "right-0 w-1/2"
              )}
            />
          </Link>
        );
      })}
    </div>
  )
}

export default HeaderMenu
