"use client";

import React from "react";
import { Search, X } from "lucide-react";

type Props = {
  onClose: () => void;
};

const SearchModal: React.FC<Props> = ({ onClose }) => {
  const suggestions = [
    "43” Class TU7000 Series Crystal UHD 4K Smart TV",
    "HP Laptop, AMD Ryzen 5 5500U Processor",
    "High Performance Cooling Fan, 4-Pin, 1500 RPM",
    "Intel 13th Gen Core i9 13900KF Raptor Lake Processor",
    "MacBook Pro M4 Max Chip 16-inch (14-core CPU, 32-core GPU)",
    "Philips NA221 4.2 Liter 1500 Watt Air Fryer",
    "Portable Mini Washing Machine, White",
    "Speak 710 Portable Speaker for Music and Calls",
    "Vitamix A3500 Brushed Stainless Blender",
    "iPad Pro M4 11-inch (WiFi+Cellular)",
    "iPhone 16 Pro Max 128GB",
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* BLUR + DARK BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="absolute left-1/2 top-1/2 w-[95%] max-w-5xl 
                   -translate-x-1/2 -translate-y-1/2 
                   bg-white rounded-2xl shadow-xl p-6 md:p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Search input */}
        <div className="flex items-center gap-3 border rounded-lg px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your product here..."
            className="w-full outline-none"
          />
        </div>

        {/* Subtitle */}
        <div className="mt-5 mb-3 border rounded-lg bg-[#eef3f0] px-4 py-3 text-sm text-gray-600">
          <span className="font-medium">Search and explore your products</span>{" "}
          from <span className="font-bold text-shop_dark_green">Zenan Zahmeti</span>
        </div>

        {/* Suggestions list */}
        <div className="max-h-[50vh] overflow-y-auto mt-2 space-y-2">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm md:text-base">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
