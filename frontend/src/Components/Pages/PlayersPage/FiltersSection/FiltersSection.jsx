"use client";

import { stripColorCodes } from "@/Functions/utils";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  resetPagination,
  setSearchTerm,
  setSortBy,
  updatePlayersState,
} from "@/Redux/slices/playersSlice";
import { fetchAllPlayers } from "@/Redux/thunks/playersThunk";
import s from "./FiltersSection.module.scss";

const FiltersSection = ({
  searchInputRef,
  handleClearSearch,
  isSearching,
  setIsSearching,
}) => {
  const { playersData, sortBy } = useSelector((s) => s.players);
  const dispatch = useDispatch();

  const searchTimeoutRef = useRef(null);

  function handleSearchInput(e) {
    const inputValue = e.target.value;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(inputValue);
    }, 300); // 300ms delay
  }

  function performSearch(searchValue) {
    if (!searchValue.trim()) {
      dispatch(setSearchTerm(""));
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Small delay to show loading state
    setTimeout(() => {
      const searchLower = searchValue.toLowerCase();
      // Search through all loaded players using stripped names (without color codes)
      const filtered = playersData.filter((player) =>
        stripColorCodes(player.name)?.toLowerCase().includes(searchLower)
      );
      dispatch(updatePlayersState({ key: "filteredPlayers", value: filtered }));
      dispatch(setSearchTerm(searchValue));
      setIsSearching(false);
    }, 100);
  }

  function handleSortChange(e) {
    const newSort = e.target.value;
    dispatch(setSortBy(newSort));
    dispatch(resetPagination());
    dispatch(fetchAllPlayers({ sort: newSort }));
  }

  return (
    <div className={s.filtersSection}>
      <div className={s.filtersContainer}>
        <div className={s.filterGroup}>
          <label className={s.filterLabel} htmlFor="player-search">
            Search
          </label>
          <div className={s.searchContainer}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search players by name..."
              onChange={handleSearchInput}
              className={s.searchInput}
              id="player-search"
            />
            {isSearching && (
              <div className={s.searchLoadingIndicator}>
                <div className={s.searchSpinner}></div>
              </div>
            )}
            <button
              onClick={handleClearSearch}
              className={s.clearButton}
              title="Clear search"
            >
              <svg>
                <use href="/icons-sprite.svg#xMark" />
              </svg>
            </button>
          </div>
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
