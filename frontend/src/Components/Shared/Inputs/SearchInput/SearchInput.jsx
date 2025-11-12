"use client";

import { createQueryString, removeQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import s from "./SearchInput.module.scss";

const SearchInput = ({ queryName, placeholder, label, id }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState(
    searchParams.get(queryName) || ""
  );

  const debounceRef = useRef(null);

  function handleOnChange(event) {
    const inputValue = event.target.value;
    setSearchValue(inputValue);

    clearTimeout(debounceRef?.current);
    debounceRef.current = setTimeout(() => performSearch(inputValue), 300);
  }

  function performSearch(searchValue) {
    if (!searchValue.trim()) {
      removeQueryString(queryName, searchParams, router, pathname);
      return;
    }

    createQueryString(
      queryName,
      searchValue.toLowerCase(),
      searchParams,
      router,
      pathname
    );
  }

  function handleClearSearch() {
    setSearchValue("");
    removeQueryString(queryName, searchParams, router, pathname);
    clearTimeout(debounceRef?.current);
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
        onChange={handleOnChange}
        value={searchValue}
        id={id}
      />

      <button
        onClick={handleClearSearch}
        className={s.clearButton}
        title="Clear search"
      >
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#xMark" />
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;
