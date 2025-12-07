"use client"
import { motion } from "motion/react";
import { useEffect, useState } from "react"
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import { error } from "console";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";


const ProductGrid = () => {
    const [products, setProduct] = useState([]);
    const [loading, setloading ] = useState(false);
    const [selectedTab, setSelectedTab ] = useState(productType[0]?.title || "");
    const query = `*[_type == "product" && variant == $variant] | order(name asc){
    ...,"categories": categories[]->title
    }`;
    const params = {variant: selectedTab.toLowerCase() };
    useEffect(()=> {
        const fetchData = async ()=> {
            setloading(true);
            try {

            } catch (error) {
                console.error("Product fetching Error:", error)
            } finally {
                setloading(false);
            };
        };
        fetchData();
    }, [selectedTab])
  return (
    <div>
      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab}/>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10
        min-h-80 gap-4 bg-gray-100 w-full mt-10">
        <div className="space-x-2 flex items-center text-green-600">
            <Loader2 className="w-5 h-6 animate-spin"/>
            <span>Product is loading ... </span>
        </div>

      </div> ):( 
        products?.length ? (
        <>Product</>
        ):(
        <NoProductAvailable selectedTab={selectedTab}/>
        )
        )}
    </div>
  )
}

export default ProductGrid
