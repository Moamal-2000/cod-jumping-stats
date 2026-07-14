"use client";

import FilterButton from "@/components/Shared/Buttons/FilterButton/FilterButton";
import { useSearchParams } from "next/navigation";
import s from "./FilterButtons.module.scss";

const FilterButtons = ({ filtersData, queryName, defaultUrlQuery }) => {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get(queryName);

  return (
    <div className={s.filters}>
      {filtersData.map(({ text, queryValue, toolTip, server, id }) => (
        <FilterButton
          key={id}
          text={text}
          queryValue={queryValue}
          queryName={queryName}
          toolTip={toolTip}
          urlQuery={urlQuery}
          defaultUrlQuery={defaultUrlQuery}
          server={server}
        />
      ))}
    </div>
  );
};

export default FilterButtons;
