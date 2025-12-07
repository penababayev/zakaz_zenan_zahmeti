// SideMenu.tsx
import React, { FC } from "react"
import Logo from "./Logo"
import { headerData } from "@/constants/data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Language } from "./Language"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  return (
    // 🔹 Arka plan (overlay)
    <div
      onClick={onClose} // dışına tıklayınca kapanır
      className={`fixed inset-0 z-40 bg-black/50 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* 🔹 Menü paneli */}
      <div
        onClick={(e) => e.stopPropagation()} // içine tıklayınca kapanmasın
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform  transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Başlık */}
        <div className="p-4 flex justify-between items-center border-b">
          <Logo/>
          <button
            onClick={onClose} // 🔹 ✕ butonu menüyü kapatır
            className="text-gray-500 hover:text-green-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide p-4">
          {headerData ?.map((item)=>(
            <Link href={item?.href} key={item?.title} className={`text-black hover:Effect ${
              pathname=== item?.href && 'text-green-700'
            }`}>
              {item?.title}
            </Link>
          ))}
          <Language/>

        </div>
      </div>
    </div>
  )
}

export default SideMenu
