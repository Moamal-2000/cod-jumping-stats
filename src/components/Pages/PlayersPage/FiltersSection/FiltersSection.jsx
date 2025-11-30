"use client";

import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import SelectMenu from "@/components/Shared/SelectMenus/SelectMenu/SelectMenu";
import { SORT_PLAYERS_OPTIONS } from "@/data/staticData";
import { createQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./FiltersSection.module.scss";

const FiltersSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams?.get("sort") || "admin";

  function handleSortChange(event) {
    const newValue = event.target.value;
    createQueryString("sort", newValue, searchParams, router, pathname);
  }

  return (
    <div className={s.filtersSection}>
      <div className={s.filtersContainer}>
        <SearchInput
          queryName="name"
          placeholder="Search players by name..."
          id="player-search"
          label="Search"
        />

        <SelectMenu
          optionsData={SORT_PLAYERS_OPTIONS}
          onChange={handleSortChange}
          value={sortBy}
          label="Sort By"
          id="players-sort"
        />
      </div>
    </div>
  );
};

export default FiltersSection;
