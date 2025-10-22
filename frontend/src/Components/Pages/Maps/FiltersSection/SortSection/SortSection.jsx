import CustomSelectMenu from "@/Components/Shared/SelectMenus/CustomSelectMenu/CustomSelectMenu";
import MapsSearchInput from "../../MapsSearchInput/MapsSearchInput";
import s from "./SortSection.module.scss";
import SortView from "./SortView/SortView";
import MapAuthorSearchInput from "../../MapAuthorSearchInput/MapAuthorSearchInput";

const SortSection = ({ setPaginationNumber }) => {
  return (
    <section className={s.sortSection}>
      <div className={s.leftSide}>
        <div className={s.sortWrapper}>
          <label htmlFor="sort-by" className={s.label}>
            Sort Maps By:
            <div className={s.tooltip}>
              <div className={s.icon}>
                <svg>
                  <use href="/icons-sprite.svg#questionMark" />
                </svg>
              </div>

              <p className={s.tooltipText}>
                Choose how to order the displayed maps
              </p>
            </div>
          </label>

          <CustomSelectMenu />
        </div>

        <MapsSearchInput />
        <MapAuthorSearchInput />
      </div>

      <SortView setPaginationNumber={setPaginationNumber} />
    </section>
  );
};

export default SortSection;
