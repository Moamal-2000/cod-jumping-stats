"use client";

import SearchInput from "@/Components/Shared/Inputs/SearchInput/SearchInput";
import { createQueryString } from "@/Functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./FiltersSection.module.scss";

const FiltersSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams?.get("sort") || "admin";

  function handleSortChange(e) {
    const newValue = e.target.value;
    createQueryString("sort", newValue, searchParams, router, pathname);
  }

  return (
    <div className={s.filtersSection}>
      <div className={s.filtersContainer}>
        <div className={s.filterGroup}>
          <label className={s.filterLabel} htmlFor="player-search">
            Search
          </label>

          <SearchInput
            queryName="name"
            placeholder="Search players by name..."
          />
        </div>

        <div className={s.filterGroup}>
          <label className={s.filterLabel} htmlFor="players-sort">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={s.sortSelect}
            id="players-sort"
          >
            <option value="admin">Admin Level</option>
            <option value="last-seen">Last Seen</option>
            <option value="visits">Visit Count</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
