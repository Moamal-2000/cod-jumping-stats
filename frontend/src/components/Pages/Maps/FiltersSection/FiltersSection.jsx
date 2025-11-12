import FilterSection from "./FilterSection/FilterSection";
import s from "./FiltersSection.module.scss";
import SortSection from "./SortSection/SortSection";

const FiltersSection = ({ setPaginationNumber }) => {
  return (
    <div className={s.filtersSection}>
      <FilterSection />
      <SortSection setPaginationNumber={setPaginationNumber} />
    </div>
  );
};

export default FiltersSection;
