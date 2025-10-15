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
import NoPlayersFound from "./NoPlayersFound/NoPlayersFound";
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

  const playersToDisplay = getPlayersToDisplay({
    displayedCount,
    searchTerm,
    filteredPlayers,
    playersData,
  });

  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const loadMoreRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const noResults = playersToDisplay.length === 0;

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(fetchAllPlayers({ sort: sortBy }));
  }, [dispatch, sortBy]);

  function handleClearSearch() {
    if (searchInputRef.current) searchInputRef.current.value = "";
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    dispatch(setSearchTerm(""));
    setIsSearching(false);
  }

  const loadMore = useCallback(() => {
    if (!hasMore && isLoadingMore && loading && searchTerm) return;

    dispatch(setIsLoadingMore(true));
    setTimeout(() => dispatch(loadMorePlayersAction()), 300);
  }, [dispatch, hasMore, isLoadingMore, loading, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loadMore]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  if (loading || error || playersData.length === 0) {
    return (
      <PlayersLoadingError sortBy={sortBy} error={error} dispatch={dispatch} />
    );
  }

  return (
    <div className={s.playersContainer}>
      <FiltersSection
        searchInputRef={searchInputRef}
        handleClearSearch={handleClearSearch}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
      <NoPlayersFound
        noResults={noResults}
        searchTerm={searchTerm}
        handleClearSearch={handleClearSearch}
      />

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

function getPlayersToDisplay({
  displayedCount,
  searchTerm,
  filteredPlayers,
  playersData,
} = {}) {
  if (searchTerm) return filteredPlayers;
  const count = displayedCount || 200;
  return playersData.slice(0, Math.min(count, playersData.length));
}
