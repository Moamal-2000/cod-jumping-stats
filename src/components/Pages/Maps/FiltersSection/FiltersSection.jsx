import FilterSection from "./FilterSection/FilterSection";
import s from "./FiltersSection.module.scss";
import SortSection from "./SortSection/SortSection";

const FiltersSection = ({ setPaginationNumber, mapsData }) => {
  return (
    <div className={s.filtersSection}>
      <FilterSection />
      <SortSection
        setPaginationNumber={setPaginationNumber}
        mapsData={mapsData}
      />
    </div>
  );
};

export default FiltersSection;
