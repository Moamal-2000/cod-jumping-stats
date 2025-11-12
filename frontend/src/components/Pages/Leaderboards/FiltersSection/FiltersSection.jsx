"use client";

import FilterCard from "@/components/Shared/Cards/FilterCard/FilterCard";
import { LEADERBOARDS_FILTERS_DATA } from "@/data/filters";
import { updateGlobalState } from "@/redux/slices/globalSlice";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import FilterButtons from "./FilterButtons/FilterButtons";
import s from "./FiltersSection.module.scss";

const FiltersSection = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateGlobalState({ key: "isLeaderboardReversed", value: false }));
  }, [searchParams]);

  return (
    <section className={s.filtersSection}>
      {LEADERBOARDS_FILTERS_DATA.map(
        ({ title, queryName, defaultUrlQuery, filtersData, id }) => {
          return (
            <FilterCard key={id} title={title}>
              <FilterButtons
                queryName={queryName.toLowerCase()}
                defaultUrlQuery={defaultUrlQuery.toLowerCase()}
                filtersData={filtersData}
              />
            </FilterCard>
          );
        }
      )}
    </section>
  );
};

export default FiltersSection;
