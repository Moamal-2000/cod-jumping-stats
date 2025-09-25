"use client";

import SvgIcon from "@/Components/Shared/SvgIcon";
import { stripColorCodes } from "@/Functions/utils";
import {
  loadMorePlayersAction,
  resetPagination,
  setIsLoadingMore,
  setSearchTerm,
  setSortBy,
  updatePlayersState,
} from "@/Redux/slices/playersSlice";
import { fetchAllPlayers } from "@/Redux/thunks/playersThunk";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerCard from "./PlayerCard/PlayerCard";
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
  } = useSelector((state) => state.players);

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
  const inputRef = useRef(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Reset pagination and fetch all players on initial load or sort change
    dispatch(resetPagination());
    dispatch(fetchAllPlayers({ sort: sortBy }));
  }, [dispatch, sortBy]);

  const performSearch = (searchValue) => {
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
  };

  const handleSearchInput = (e) => {
    const inputValue = e.target.value;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(inputValue);
    }, 300); // 300ms delay
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    dispatch(setSortBy(newSort));
    dispatch(resetPagination());
    dispatch(fetchAllPlayers({ sort: newSort }));
  };

  const handleClearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear input immediately
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

  if (loading || playersData.length === 0) {
    return (
      <div className={s.loadingContainer}>
        <div className={s.loadingSpinner}></div>
        <p>Loading players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.errorContainer}>
        <h2>Error Loading Players</h2>
        <p>Unable to fetch players data. Please try again later.</p>
        <button
          onClick={() => {
            dispatch(resetPagination());
            dispatch(fetchAllPlayers({ sort: sortBy }));
          }}
          className={s.retryButton}
        >
          Retry
        </button>
      </div>
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

      <div className={s.filtersSection}>
        <div className={s.filtersContainer}>
          <div className={s.filterGroup}>
            <label className={s.filterLabel} htmlFor="player-search">
              Search
            </label>
            <div className={s.searchContainer}>
              <input
                ref={inputRef}
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
                <SvgIcon name="xMark" />
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

      <section className={s.playersSection}>
        {playersToDisplay.length === 0 ? (
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
        ) : (
          <>
            {playersToDisplay.map((playerData, index) => (
              <PlayerCard
                key={playerData.id}
                rank={index + 1}
                {...playerData}
              />
            ))}

            {/* Loading indicator for infinite scroll */}
            {isLoadingMore && (
              <div className={s.loadingMoreContainer}>
                <div className={s.loadingSpinner}></div>
                <p>Loading more players...</p>
              </div>
            )}

            {/* Intersection observer target - only show when not searching */}
            {hasMore && !isLoadingMore && !searchTerm && (
              <div ref={loadMoreRef} className={s.loadMoreTrigger} />
            )}

            {/* End of results message - only show when not searching */}
            {!hasMore && playersToDisplay.length > 0 && !searchTerm && (
              <div className={s.endOfResults}>
                <p>You've reached the end of the players list!</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default PlayersPage;
