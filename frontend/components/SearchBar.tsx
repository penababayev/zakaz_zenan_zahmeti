"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";
import SearchModal from "./SearchModal";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center"
      >
        <Search className="w-5 h-5 hover:text-shop_dark_green hoverEffect cursor-pointer" />
      </button>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default SearchBar;
