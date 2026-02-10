import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import CustomSelectMenu from "@/components/Shared/SelectMenus/CustomSelectMenu/CustomSelectMenu";
import { getMapsAuthors } from "@/functions/utils";
import s from "./SortSection.module.scss";
import SortView from "./SortView/SortView";

const SortSection = ({ setPaginationNumber, mapsData }) => {
  return (
    <section className={s.sortSection}>
      <div className={s.leftSide}>
        <div className={s.sortWrapper}>
          <label htmlFor="sort-by" className={s.label}>
            Sort Maps By:
            <div className={s.tooltip}>
              <div className={s.icon}>
                <svg aria-hidden="true">
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

        <SearchInput placeholder="Search maps by name..." queryName="name" />
        <SearchInput
          placeholder="Search maps by author name..."
          queryName="author"
        />
        <ComboBox
          placeholder="maps by author name..."
          options={getMapsAuthors(mapsData)}
          id="author"
          queryName="author"
        />
      </div>

      <SortView setPaginationNumber={setPaginationNumber} />
    </section>
  );
};

export default SortSection;
