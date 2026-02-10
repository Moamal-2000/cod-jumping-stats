import FilterSection from "./FilterSection/FilterSection";
import s from "./FiltersSection.module.scss";
import SortSection from "./SortSection/SortSection";

const FiltersSection = ({ setPaginationNumber, allMaps }) => {
  return (
    <div className={s.filtersSection}>
      <FilterSection />
      <SortSection
        setPaginationNumber={setPaginationNumber}
        allMaps={allMaps}
      />
    </div>
  );
};

export default FiltersSection;
