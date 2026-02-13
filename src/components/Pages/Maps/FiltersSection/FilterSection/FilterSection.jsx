import CustomSelectMenu from "@/components/Shared/SelectMenus/CustomSelectMenu/CustomSelectMenu";
import { MAPS_FILTERS_DATA } from "@/data/filters";
import FilterGroup from "../FilterGroup/FilterGroup";
import LegendLabel from "../FilterGroup/LegendLabel/LegendLabel";
import s from "./FilterSection.module.scss";

const FilterSection = () => {
  return (
    <section className={s.filtersSection}>
      <fieldset className={s.sortWrapper}>
        <LegendLabel
          label="Sort Maps By:"
          tooltipText="Choose how to order the displayed maps"
        />
        <CustomSelectMenu id="sort-by" />
      </fieldset>

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
        ),
      )}
    </section>
  );
};

export default FilterSection;
