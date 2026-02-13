import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import CustomSelectMenu from "@/components/Shared/SelectMenus/CustomSelectMenu/CustomSelectMenu";
import { TOTAL_MAPS_PLACEHOLDER } from "@/data/constants";
import { getMapsAuthors } from "@/functions/utils";
import s from "./SortSection.module.scss";
import SortView from "./SortView/SortView";

const SortSection = ({
  setPaginationNumber,
  allMaps,
  mapsData,
  mapsScroll,
}) => {
  const totalMaps = mapsData?.length || TOTAL_MAPS_PLACEHOLDER;
  const displayedMaps = mapsScroll?.length || 0;

  return (
    <section className={s.sortSection}>
      <div className={s.leftSide}>
        <CustomSelectMenu id="sort-by" />

        <SearchInput
          placeholder="Search maps by name..."
          queryName="name"
          autoFocus={true}
        />
        <ComboBox
          placeholder="Maps by author name..."
          id="author"
          queryName="author"
          options={getMapsAuthors(allMaps)}
          orderByMapsCount={true}
        />

        <p className={s.totalMapsText}>
          Showing <span>{displayedMaps}</span> of <span>{totalMaps}</span> maps
        </p>
      </div>

      <SortView setPaginationNumber={setPaginationNumber} />
    </section>
  );
};

export default SortSection;
