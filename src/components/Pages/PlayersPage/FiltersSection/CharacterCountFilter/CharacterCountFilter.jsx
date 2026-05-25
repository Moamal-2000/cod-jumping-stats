"use client";

import LegendLabel from "@/components/Pages/Maps/FiltersSection/FilterGroup/LegendLabel/LegendLabel";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import s from "./CharacterCountFilter.module.scss";

const CharacterCountFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentValue = searchParams.get("charcount") || "";
  const [searchValue, setSearchValue] = useState(currentValue);

  const debounceRef = useRef(null);

  const [minChars, maxChars] = currentValue
    ? currentValue.split("-")
    : ["", ""];

  function handleRangeChange(min, max) {
    setSearchValue(`${min}-${max}`);
    clearTimeout(debounceRef?.current);
    debounceRef.current = setTimeout(() => performSearch(min, max), 400);
  }

  function performSearch(min, max) {
    if (min === "" && max === "") {
      removeQueryString("charcount", searchParams, router, pathname);
      return;
    }

    const value = `${min}-${max}`;
    createQueryString("charcount", value, searchParams, router, pathname);
  }

  return (
    <fieldset className={s.filterGroup}>
      <LegendLabel className={s.label} label="Character Count" />

      <div className={s.rangeInputContainer}>
        <input
          type="number"
          min="0"
          max="50"
          value={searchValue.split("-")[0] || ""}
          onChange={(e) => handleRangeChange(e.target.value, maxChars)}
          placeholder="Min"
          className={s.rangeInput}
        />

        <span className={s.separator}>-</span>

        <input
          type="number"
          min="0"
          max="50"
          value={searchValue.split("-")[1] || ""}
          onChange={(e) => handleRangeChange(minChars, e.target.value)}
          placeholder="Max"
          className={s.rangeInput}
        />
      </div>
    </fieldset>
  );
};

export default CharacterCountFilter;
