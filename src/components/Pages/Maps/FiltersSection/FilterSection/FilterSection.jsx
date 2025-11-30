import { MAPS_FILTERS_DATA } from "@/data/filters";
import FilterGroup from "../FilterGroup/FilterGroup";
import s from "./FilterSection.module.scss";

const FilterSection = () => {
  return (
    <section className={s.filtersSection}>
      {MAPS_FILTERS_DATA.map(
        ({ label, queryName, defaultUrlQuery, filtersData, tooltipText }) => (
          <FilterGroup
            key={queryName}
            {...{
              label,
              queryName,
              defaultUrlQuery,
              filtersData,
              tooltipText,
            }}
          />
        )
      )}
    </section>
  );
};

export default FilterSection;
