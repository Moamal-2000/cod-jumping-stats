"use client";

import { createQueryString, removeQueryString } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ClearButton from "../../Buttons/ClearButton/ClearButton";
import s from "./SearchInput.module.scss";

const SearchInput = ({
  queryName,
  placeholder,
  label,
  type = "text",
  id,
  inputMode = "text",
  autoFocus = false,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentValue = searchParams.get(queryName) || "";
  const [searchValue, setSearchValue] = useState(currentValue);

  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  function handleOnChange(event) {
    let inputValue = event.target.value;

    if (inputMode === "numeric") {
      inputValue = inputValue.replace(/\D/g, "");
    }

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
      pathname,
    );
  }

  function handleClearSearch() {
    setSearchValue("");
    removeQueryString(queryName, searchParams, router, pathname);
    clearTimeout(debounceRef?.current);
  }

  useEffect(() => {
    if (currentValue === "") setSearchValue("");
  }, [currentValue]);

  useEffect(() => {
    if (typeof window === "undefined" || !autoFocus) return;

    const isDesktop =
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches;

    if (isDesktop) inputRef.current.focus();
  }, []);

  return (
    <div className={s.searchContainer}>
      {label !== undefined && (
        <label className={s.filterLabel} htmlFor={id}>
          {label}
        </label>
      )}

      <input
        className={s.searchInput}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={searchValue}
        type={type}
        id={id}
        ref={inputRef}
      />

      <ClearButton
        label="Clear search"
        handleClear={handleClearSearch}
        disabled={searchValue === ""}
        inputValue={searchValue}
      />
    </div>
  );
};

export default SearchInput;
