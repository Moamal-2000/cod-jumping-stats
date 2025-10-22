import {
  clearSearch,
  setFilteredMaps,
  setSearchTerm,
} from "@/Redux/slices/mapsSlice";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./MapAuthorSearchInput.module.scss";

const MapAuthorSearchInput = () => {
  const dispatch = useDispatch();
  const { mapsData } = useSelector((s) => s.maps);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  function performSearch(searchValue) {
    if (!searchValue.trim()) {
      dispatch(clearSearch());
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const searchLowerCased = searchValue.toLowerCase();
    const filteredMaps = mapsData.filter((map) =>
      map.Author?.toLowerCase().includes(searchLowerCased)
    );

    dispatch(setFilteredMaps(filteredMaps));
    dispatch(setSearchTerm(searchValue));
    setIsSearching(false);
  }

  function handleSearchInput(event) {
    const inputValue = event.target.value;

    clearTimeout(searchTimeoutRef?.current);
    searchTimeoutRef.current = setTimeout(() => performSearch(inputValue), 300);
  }

  function handleClearSearch() {
    if (inputRef.current) inputRef.current.value = "";

    clearTimeout(searchTimeoutRef?.current);

    dispatch(clearSearch());
    setIsSearching(false);
  }

  return (
    <div className={s.searchContainer}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search maps by author name..."
        onChange={handleSearchInput}
        className={s.searchInput}
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
  );
};

export default MapAuthorSearchInput;
