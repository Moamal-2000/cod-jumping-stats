"use client";

import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import SelectMenu from "@/components/Shared/SelectMenus/SelectMenu/SelectMenu";
import { FILTER_PLAYERS_BADGES, SORT_PLAYERS_OPTIONS } from "@/data/staticData";
import { createQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./FiltersSection.module.scss";

const FiltersSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams?.get("sort") || "admin";
  const filterBy = searchParams?.get("badge") || "all";

  function handleSortChange(event) {
    const newValue = event.target.value;
    createQueryString("sort", newValue, searchParams, router, pathname);
  }

  function handleFilterChange(event) {
    const newValue = event.target.value;
    createQueryString("badge", newValue, searchParams, router, pathname);
  }

  return (
    <div className={s.filtersSection}>
      <div className={s.filtersContainer}>
        <SearchInput
          queryName="name"
          placeholder="Search players by name..."
          id="player-name-search"
        />

        <SearchInput
          queryName="id"
          placeholder="Search players by ID..."
          id="player-id-search"
          inputMode="numeric"
        />

        <SelectMenu
          optionsData={SORT_PLAYERS_OPTIONS}
          onChange={handleSortChange}
          value={sortBy}
          label="Sort By"
          id="players-sort"
        />

        <SelectMenu
          optionsData={FILTER_PLAYERS_BADGES}
          onChange={handleFilterChange}
          value={filterBy}
          label="Filter By Badges"
          id="players-filter-badges"
        />
      </div>
    </div>
  );
};

export default FiltersSection;
