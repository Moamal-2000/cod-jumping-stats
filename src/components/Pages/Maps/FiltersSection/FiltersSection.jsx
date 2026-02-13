import FilterSection from "./FilterSection/FilterSection";
import s from "./FiltersSection.module.scss";
import SortSection from "./SortSection/SortSection";

const FiltersSection = ({
  setPaginationNumber,
  allMaps,
  mapsData,
  mapsScroll,
}) => {
  return (
    <section className={s.filtersSection}>
      <FilterSection />
      <SortSection
        setPaginationNumber={setPaginationNumber}
        allMaps={allMaps}
        mapsData={mapsData}
        mapsScroll={mapsScroll}
      />
    </section>
  );
};

export default FiltersSection;
