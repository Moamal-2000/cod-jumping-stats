"use client";

import { createQueryString, removeQueryString } from "@/Functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import s from "./SearchInput.module.scss";

const SearchInput = ({ queryName, placeholder, label, id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get(queryName) || ""
  );
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  function handleSearchInput(event) {
    const inputValue = event.target.value;
    setSearchValue(inputValue);

    clearTimeout(searchTimeoutRef?.current);
    searchTimeoutRef.current = setTimeout(() => performSearch(inputValue), 300);
  }

  function performSearch(searchValue) {
    if (!searchValue.trim()) {
      setIsSearching(false);
      removeQueryString(queryName, searchParams, router, pathname);
      return;
    }
    setIsSearching(true);

    const searchLowerCased = searchValue.toLowerCase();

    createQueryString(
      queryName,
      searchLowerCased,
      searchParams,
      router,
      pathname
    );
    setIsSearching(false);
  }

  function handleClearSearch() {
    if (inputRef.current) inputRef.current.value = "";
    removeQueryString(queryName, searchParams, router, pathname);
    clearTimeout(searchTimeoutRef?.current);
    setIsSearching(false);
  }

  return (
    <div className={s.searchContainer}>
      {label !== undefined && (
        <label className={s.filterLabel} htmlFor={id}>
          {label}
        </label>
      )}

      <input
        className={s.searchInput}
        type="text"
        placeholder={placeholder}
        onChange={handleSearchInput}
        value={searchValue}
        ref={inputRef}
        id={id}
      />

      {isSearching && (
        <div className={s.searchLoadingIndicator}>
          <div className={s.searchSpinner} />
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

export default SearchInput;
