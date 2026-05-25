import CheckboxButtons from "./CheckboxButtons/CheckboxButtons";
import FilterButtons from "./FilterButtons/FilterButtons";
import s from "./FilterGroup.module.scss";
import LegendLabel from "./LegendLabel/LegendLabel";

const FilterGroup = ({
  label,
  queryName,
  defaultUrlQuery,
  filtersData,
  tooltipText,
  groupType,
  themeColor = "green",
}) => {
  return (
    <fieldset className={`${s.filterGroup} ${s[groupType]}`}>
      <LegendLabel
        className={s.label}
        label={label}
        tooltipText={tooltipText}
      />

      {groupType === "select" && (
        <FilterButtons
          filtersData={filtersData}
          queryName={queryName}
          defaultUrlQuery={defaultUrlQuery}
          themeColor={themeColor}
        />
      )}

      {groupType === "checkbox" && (
        <CheckboxButtons
          filtersData={filtersData}
          queryName={queryName}
          themeColor={themeColor}
        />
      )}
    </fieldset>
  );
};

export default FilterGroup;
