"use client";

import SortViewButtons from "@/components/Shared/Buttons/SortViewButtons/SortViewButtons";
import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import ResultsSummary from "@/components/Shared/Texts/ResultsSummary/ResultsSummary";
import { PLAYERS_FILTERS_DATA } from "@/data/filters";
import { comboboxCountryNames } from "@/lib/filters";
import { useSelector } from "react-redux";
import FilterGroup from "../../Maps/FiltersSection/FilterGroup/FilterGroup";
import CharacterCountFilter from "./CharacterCountFilter/CharacterCountFilter";
import s from "./FiltersSection.module.scss";
import LastSeenDateFilter from "./LastSeenDateFilter/LastSeenDateFilter";

const FiltersSection = () => {
  const { allPlayersData, playersScroll } = useSelector((s) => s.players);

  const normalizedCountryNames = comboboxCountryNames({
    allData: allPlayersData,
    fullCountryName: true,
  });

  return (
    <section className={s.filtersSection}>
      <div className={s.row}>
        {PLAYERS_FILTERS_DATA.map((filter) => (
          <FilterGroup key={filter.queryName} {...filter} />
        ))}
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

      <div className={`${s.row} ${s.thirdRow}`}>
        <div className={s.advancedFilters}>
          <CharacterCountFilter />
          <LastSeenDateFilter />
          {/* <PlayersColorFilter /> */}
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
