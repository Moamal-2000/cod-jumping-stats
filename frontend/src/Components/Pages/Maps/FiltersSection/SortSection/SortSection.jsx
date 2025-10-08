import { setSortBy } from "@/Redux/slices/mapsSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./SortSection.module.scss";
import SortView from "./SortView/SortView";

const SortSection = ({ setPaginationNumber }) => {
  const dispatch = useDispatch();
  const { sortBy } = useSelector((state) => state.maps);

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  return (
    <section className={s.sortSection}>
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

        <select
          id="sort-by"
          value={sortBy}
          onChange={handleSortChange}
          className={s.sortSelect}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name-a-z">Name (A-Z)</option>
          <option value="name-z-a">Name (Z-A)</option>
          <option value="43-difficulty">43 fps (Difficulty)</option>
          <option value="76-difficulty">76 fps (Difficulty)</option>
          <option value="125-difficulty">125 fps (Difficulty)</option>
          <option value="250-difficulty">250 fps (Difficulty)</option>
          <option value="333-difficulty">333 fps (Difficulty)</option>
        </select>
      </div>

      <SortView setPaginationNumber={setPaginationNumber} />
    </section>
  );
};

export default SortSection;
