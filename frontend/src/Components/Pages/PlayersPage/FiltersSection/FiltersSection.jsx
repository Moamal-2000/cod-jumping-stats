"use client";

import { useDispatch, useSelector } from "react-redux";

import MapsSearchInput from "@/Components/Shared/Inputs/MapsSearchInput/MapsSearchInput";
import { resetPagination, setSortBy } from "@/Redux/slices/playersSlice";
import { fetchAllPlayers } from "@/Redux/thunks/playersThunk";
import s from "./FiltersSection.module.scss";

const FiltersSection = () => {
  const { sortBy } = useSelector((s) => s.players);
  const dispatch = useDispatch();

  function handleSortChange(e) {
    const newSort = e.target.value;
    dispatch(setSortBy(newSort));
    dispatch(resetPagination());
    dispatch(fetchAllPlayers());
  }

  return (
    <div className={s.filtersSection}>
      <div className={s.filtersContainer}>
        <div className={s.filterGroup}>
          <label className={s.filterLabel} htmlFor="player-search">
            Search
          </label>

          <MapsSearchInput
            queryName="name"
            placeholder="Search players by name..."
          />
        </div>

        <div className={s.filterGroup}>
          <label className={s.filterLabel} htmlFor="player-sort">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={s.sortSelect}
            id="player-sort"
          >
            <option value="admin">Admin Level</option>
            <option value="last_seen">Last Seen</option>
            <option value="visits">Visit Count</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
