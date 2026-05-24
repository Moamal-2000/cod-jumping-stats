"use client";

import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./CharacterCountFilter.module.scss";

const CharacterCountFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const charCountParam = searchParams?.get("charcount") || "";

  function handleCharCountChange(value) {
    if (value === "") {
      removeQueryString("charcount", searchParams, router, pathname);
    } else {
      createQueryString("charcount", value, searchParams, router, pathname);
    }
  }

  return (
    <div className={s.filterGroup}>
      <label htmlFor="char-count-filter" className={s.filterLabel}>
        Character Count
      </label>
      <select
        id="char-count-filter"
        value={charCountParam}
        onChange={(e) => handleCharCountChange(e.target.value)}
        className={s.select}
      >
        <option value="">All</option>
        <option value="0-5">1-5 Characters</option>
        <option value="6-10">6-10 Characters</option>
        <option value="11-15">11-15 Characters</option>
        <option value="16-20">16-20 Characters</option>
        <option value="21-999">21+ Characters</option>
      </select>
    </div>
  );
};

export default CharacterCountFilter;
