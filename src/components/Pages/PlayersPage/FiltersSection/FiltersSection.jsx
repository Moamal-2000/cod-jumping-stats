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
    <section className={s.filtersSection}>
      <div className={`${s.filterGroup} ${s.searchGroup}`}>
        <span className={s.filterLabel}>Search With</span>

        <div className={s.fields}>
          <SearchInput
            queryName="name"
            placeholder="Player Name"
            id="player-name-search"
            autoFocus={true}
          />

          <SearchInput
            queryName="id"
            placeholder="Player ID"
            id="player-id-search"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className={s.controls}>
        <div className={`${s.filterGroup} ${s.selectGroup}`}>
          <label className={s.filterLabel} htmlFor="players-filter-badges">
            Filter By Badges
          </label>
          <SelectMenu
            optionsData={FILTER_PLAYERS_BADGES}
            onChange={handleFilterChange}
            value={filterBy}
            id="players-filter-badges"
          />
        </div>

        <div className={`${s.filterGroup} ${s.sortGroup}`}>
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
      </div>
    </section>
  );
};

export default FiltersSection;
