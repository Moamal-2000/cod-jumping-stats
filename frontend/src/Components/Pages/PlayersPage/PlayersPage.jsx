"use client";

import {
  loadMorePlayersAction,
  resetPagination,
  setIsLoadingMore,
  setSearchTerm,
} from "@/Redux/slices/playersSlice";
import { fetchAllPlayers } from "@/Redux/thunks/playersThunk";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltersSection from "./FiltersSection/FiltersSection";
import PlayersCardsSection from "./PlayersCardsSection/PlayersCardsSection";
import PlayersLoadingError from "./PlayersLoadingError/PlayersLoadingError";
import s from "./PlayersPage.module.scss";

const PlayersPage = () => {
  const {
    playersData,
    filteredPlayers,
    loading,
    error,
    searchTerm,
    sortBy,
    displayedCount,
    hasMore,
    isLoadingMore,
  } = useSelector((s) => s.players);

  // Calculate how many players to display based on client-side pagination
  const effectiveDisplayedCount = displayedCount || 200; // Fallback to 200 if undefined
  const playersToDisplay = searchTerm
    ? filteredPlayers // Show all filtered results when searching
    : playersData.slice(
        0,
        Math.min(effectiveDisplayedCount, playersData.length)
      ); // Show only the first displayedCount players when not searching

  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const noResults = playersToDisplay.length === 0;

  useEffect(() => {
    // Reset pagination and fetch all players on initial load or sort change
    dispatch(resetPagination());
    dispatch(fetchAllPlayers({ sort: sortBy }));
  }, [dispatch, sortBy]);

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ""; // Clear input immediately
    }

    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    dispatch(setSearchTerm(""));
    setIsSearching(false);
  };

  const loadMore = useCallback(() => {
    // Don't load more when searching - search shows all matching results
    if (hasMore && !isLoadingMore && !loading && !searchTerm) {
      dispatch(setIsLoadingMore(true));
      // Simulate a small delay for better UX
      setTimeout(() => {
        dispatch(loadMorePlayersAction());
      }, 300);
    }
  }, [dispatch, hasMore, isLoadingMore, loading, searchTerm]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMore]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (loading || error || playersData.length === 0) {
    return (
      <PlayersLoadingError
        loading={loading}
        sortBy={sortBy}
        dispatch={dispatch}
      />
    );
  }

  return (
    <div className={s.playersContainer}>
      <div className={s.playersHeader}>
        <div className={s.titleSection}>
          <h1 className={s.playersTitle}>Players</h1>
          <p className={s.playersSubtitle}>
            {searchTerm
              ? `${filteredPlayers.length} player${
                  filteredPlayers.length !== 1 ? "s" : ""
                } found`
              : `${playersData.length} player${
                  playersData.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>
      </div>

      <FiltersSection
        searchInputRef={searchInputRef}
        handleClearSearch={handleClearSearch}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />

      <section className={s.playersSection}>
        {noResults && (
          <div className={s.noResults}>
            <h3>No players found</h3>
            <p>
              {searchTerm
                ? `No players match "${searchTerm}"`
                : "No players available at the moment"}
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className={s.clearSearchButton}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>

      {!noResults && (
        <PlayersCardsSection
          playersToDisplay={playersToDisplay}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMoreRef={loadMoreRef}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default PlayersPage;
