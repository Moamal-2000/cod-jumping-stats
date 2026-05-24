"use client";

import SortViewButtons from "@/components/Shared/Buttons/SortViewButtons/SortViewButtons";
import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import ResultsSummary from "@/components/Shared/Texts/ResultsSummary/ResultsSummary";
import { SORT_PLAYERS_OPTIONS } from "@/data/staticData";
import { comboboxCountryNames } from "@/lib/filters";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import CharacterCountFilter from "./CharacterCountFilter/CharacterCountFilter";
import ColoredPlayersToggle from "./ColoredPlayersToggle/ColoredPlayersToggle";
import s from "./FiltersSection.module.scss";
import LastSeenDateFilter from "./LastSeenDateFilter/LastSeenDateFilter";
import PlayersColorFilter from "./PlayersColorFilter/PlayersColorFilter";

const FiltersSection = () => {
  const { allPlayersData, playersScroll } = useSelector((s) => s.players);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sortBy = searchParams?.get("sort") || "last-seen";
  const normalizedCountryNames = comboboxCountryNames({
    allData: allPlayersData,
    fullCountryName: true,
  });

  function handleSortChange(newValue) {
    const isDefault = newValue === "last-seen";

    if (isDefault) {
      removeQueryString("sort", searchParams, router, pathname);
    }

    if (!isDefault) {
      createQueryString("sort", newValue, searchParams, router, pathname);
    }
  }

  return (
    <section className={s.filtersSection}>
      <div className={s.row}>
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

      <div className={`${s.row} ${s.secondRow}`}>
        <div className={s.row}>
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

              <ComboBox
                queryName="country"
                options={normalizedCountryNames}
                placeholder="Search by player country..."
                orderByCount
              />
            </div>
          </div>

          <ResultsSummary
            displayCount={playersScroll.length}
            total={allPlayersData.length}
            label="players"
            className={s.resultsSummary}
          />
        </div>

        <SortViewButtons />
      </div>

      <div className={`${s.row} ${s.advancedFiltersRow}`}>
        <div className={s.filtersGrid}>
          <CharacterCountFilter />
          <LastSeenDateFilter />
          <ColoredPlayersToggle />
          <PlayersColorFilter />
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
