"use client";

import { removeQueryString } from "@/Functions/utils";
import { updateGlobalState } from "@/Redux/slices/globalSlice";
import {
  loadMorePlayersAction,
  resetPagination,
  setIsLoadingMore,
} from "@/Redux/slices/playersSlice";
import { fetchAllPlayers } from "@/Redux/thunks/playersThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltersSection from "./FiltersSection/FiltersSection";
import NoPlayersFound from "./NoPlayersFound/NoPlayersFound";
import PlayersCardsSection from "./PlayersCardsSection/PlayersCardsSection";
import PlayersLoadingError from "./PlayersLoadingError/PlayersLoadingError";
import s from "./PlayersPage.module.scss";

const PlayersPage = () => {
  const dispatch = useDispatch();
  const {
    playersData,
    loading,
    error,
    searchTerm,
    displayedCount,
    hasMore,
    isLoadingMore,
  } = useSelector((s) => s.players);

  const playersToDisplay = getPlayersToDisplay({
    displayedCount,
    playersData,
  });

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());

  const searchInputRef = useRef(null);
  const loadMoreRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const noResults = playersToDisplay.length === 0;

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(fetchAllPlayers(paramsObject));
  }, [searchParams]);

  function handleClearSearch() {
    if (searchInputRef.current) searchInputRef.current.value = "";
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    removeQueryString("name", searchParams, router, pathname);
  }

  const loadMore = useCallback(() => {
    if (!hasMore && isLoadingMore && loading && searchTerm) return;

    dispatch(setIsLoadingMore(true));
    setTimeout(() => dispatch(loadMorePlayersAction()), 300);
  }, [dispatch, hasMore, isLoadingMore, loading, searchTerm]);

  function handleMouseLeave() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: null }));
  }

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
      clearTimeout(searchTimeoutRef?.current);
    };
  }, []);

  if (loading || error) {
    return <PlayersLoadingError error={error} dispatch={dispatch} />;
  }

  return (
    <div className={s.playersContainer} onMouseLeave={handleMouseLeave}>
      <FiltersSection />
      <NoPlayersFound
        noResults={noResults}
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

function getPlayersToDisplay({ displayedCount, playersData } = {}) {
  const count = displayedCount || 200;
  return playersData.slice(0, Math.min(count, playersData.length));
}
