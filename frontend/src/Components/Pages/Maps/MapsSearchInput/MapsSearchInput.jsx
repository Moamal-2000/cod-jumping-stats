"use client";

import { createQueryString, removeQueryString } from "@/Functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import s from "./MapsSearchInput.module.scss";

const MapsSearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  function performSearch(searchValue) {
    if (!searchValue.trim()) {
      setIsSearching(false);
      removeQueryString("name", searchParams, router, pathname);
      return;
    }
    setIsSearching(true);

    const searchLowerCased = searchValue.toLowerCase();

    createQueryString("name", searchLowerCased, searchParams, router, pathname);
    setIsSearching(false);
  }

  function handleSearchInput(event) {
    const inputValue = event.target.value;

    clearTimeout(searchTimeoutRef?.current);
    searchTimeoutRef.current = setTimeout(() => performSearch(inputValue), 300);
  }

  function handleClearSearch() {
    if (inputRef.current) inputRef.current.value = "";
    removeQueryString("name", searchParams, router, pathname);
    clearTimeout(searchTimeoutRef?.current);
    setIsSearching(false);
  }

  return (
    <div className={s.searchContainer}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search maps by name..."
        onChange={handleSearchInput}
        className={s.searchInput}
      />
      {isSearching && (
        <div className={s.searchLoadingIndicator}>
          <div className={s.searchSpinner}></div>
        </div>
      )}
      <button
        onClick={handleClearSearch}
        className={s.clearButton}
        title="Clear search"
      >
        <svg>
          <use href="/icons-sprite.svg#xMark" />
        </svg>
      </button>
    </div>
  );
};

export default MapsSearchInput;
