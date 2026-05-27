"use client";

import ClearButton from "@/components/Shared/Buttons/ClearButton/ClearButton";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import s from "./LastSeenDateFilter.module.scss";

const LastSeenDateFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const lastSeenYearParam = searchParams?.get("lastseenyear") || "";
  const currentYear = new Date().getFullYear();

  const [yearValue, setYearValue] = useState(lastSeenYearParam);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  function handleLastSeenYearChange(value) {
    setYearValue(value);
    clearTimeout(debounceRef?.current);
    debounceRef.current = setTimeout(() => performSearch(value), 300);
  }

  function performSearch(value) {
    if (value === "") {
      removeQueryString("lastseenyear", searchParams, router, pathname);
      return;
    }

    createQueryString("lastseenyear", value, searchParams, router, pathname);
  }

  function handleClearYear() {
    setYearValue("");
    removeQueryString("lastseenyear", searchParams, router, pathname);
    clearTimeout(debounceRef?.current);
    inputRef.current?.focus();
  }

  useEffect(() => {
    setYearValue(lastSeenYearParam);
  }, [lastSeenYearParam]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef?.current);
    };
  }, []);

  return (
    <div className={s.filterGroup}>
      <label htmlFor="last-seen-year-filter" className={s.filterLabel}>
        Last Seen Year
      </label>
      <div className={s.inputWrapper}>
        <input
          type="number"
          id="last-seen-year-filter"
          min="2015"
          max={currentYear}
          value={yearValue}
          placeholder="YYYY"
          onChange={(e) => handleLastSeenYearChange(e.target.value)}
          className={s.yearInput}
          ref={inputRef}
        />
        <ClearButton
          label="Clear year filter"
          handleClear={handleClearYear}
          disabled={yearValue === ""}
          inputValue={yearValue}
        />
      </div>
    </div>
  );
};

export default LastSeenDateFilter;
