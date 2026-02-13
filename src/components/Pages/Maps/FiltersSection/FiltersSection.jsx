import { TOTAL_MAPS_PLACEHOLDER } from "@/data/constants";
import FilterSection from "./FilterSection/FilterSection";
import s from "./FiltersSection.module.scss";
import SortSection from "./SortSection/SortSection";

const FiltersSection = ({
  setPaginationNumber,
  allMaps,
  mapsData,
  mapsScroll,
}) => {
  const totalMaps = mapsData?.length || TOTAL_MAPS_PLACEHOLDER;
  const displayedMaps = mapsScroll?.length || 0;

  return (
    <section className={s.filtersSection}>
      <FilterSection />
      <SortSection
        setPaginationNumber={setPaginationNumber}
        allMaps={allMaps}
      />
      <p className={s.totalMapsText}>
        Showing <span>{displayedMaps}</span> of <span>{totalMaps}</span> maps
      </p>
    </section>
  );
};

export default FiltersSection;
