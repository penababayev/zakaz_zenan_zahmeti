import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className="group hoverEffect inline-flex"  // 🔹 group ekledik
    >
      <h2 className={cn(
          "text-2xl font-black tracking-wider font-sans transition-colors duration-300",
          "text-green-700 group-hover:text-black", // Zenan -> yeşil
          className
        )}>
        Zenan
        <span
          className="text-black group-hover:text-green-700 transition-colors duration-300"
        >
          Zähmeti
        </span>
      </h2>
    </Link>
  )
}

export default Logo
