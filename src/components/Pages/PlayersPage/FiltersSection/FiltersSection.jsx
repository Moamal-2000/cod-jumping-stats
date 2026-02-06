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

  function handleSortChange(newValue) {
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

        <div className={s.filterGroup}>
          <span className={s.filterLabel}>Sort By</span>
          <div className={s.sortButtons} role="group" aria-label="Sort players">
            {SORT_PLAYERS_OPTIONS.map(({ label, value, id }) => {
              const isActive = sortBy === value;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSortChange(value)}
                  className={`${s.sortButton} ${isActive ? s.active : ""}`}
                  aria-pressed={isActive}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

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
