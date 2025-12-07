import React from 'react'
import Link from 'next/link'
import { productType } from '@/constants/data'

interface Props{
    selectedTab: string;
    onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({selectedTab, onTabSelect}:Props) => {
    console.log(selectedTab)
  return (
    <div className='flex items-center justify-between flex-wrap gap-5'>
      <div className='flex items-center gap-3 text-sm font-semibold'>
        {productType?.map((item)=>(
            <button onClick={()=> onTabSelect(item?.title)}
                key={item?.title} className={`border border-shop_btn_dark_green px-4 py-1.5
                md:px-6 md:py-2 rounded-full hover:bg-green-800 hover:text-white hoverEffect ${selectedTab === item?.title ? 'bg-green-600 text-white border-shop_dark_green ': 'bg-green-500 text-white' }`}>
                {item?.title}
            </button>
        ))}
      </div>
        <Link href={"/shop"} className={`border border-shop_btn_dark_green px-4 py-1.5
                md:px-6 md:py-2 rounded-full hover:bg-green-800 hover:text-white hoverEffect`}>
                    See all
        </Link>
    </div>
  )
}

export default HomeTabBar
