"use client";

import { PLAYERS_BATCH_SIZE } from "@/data/constants";
import {
  getIsLastPagination,
  paginateData,
  removeQueryString,
} from "@/functions/utils";
import useInfiniteScroll from "@/hooks/app/useInfiniteScroll";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { updatePlayersState } from "@/redux/features/players/slice/playersSlice";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltersSection from "./FiltersSection/FiltersSection";
import NoPlayersFound from "./NoPlayersFound/NoPlayersFound";
import PlayersCardsSection from "./PlayersCardsSection/PlayersCardsSection";
import PlayersLoadingError from "./PlayersLoadingError/PlayersLoadingError";
import s from "./PlayersPage.module.scss";

const PlayersPage = () => {
  const dispatch = useDispatch();
  const { playersData, playersScroll, allDataDisplayed, loading, error } =
    useSelector((s) => s.players);
  const { pageVisits } = useSelector((s) => s.global);

  const [lastPlayerRef, paginationNumber, setPaginationNumber] =
    useInfiniteScroll(playersData, null, PLAYERS_BATCH_SIZE);

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  const searchByName = searchParams.get("name") || "";
  const searchById = searchParams.get("id") || "";

  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const hasPlayers = playersScroll.length > 0;
  const showNoPlayersUI =
    (searchByName !== "" || searchById !== "") && !hasPlayers;

  function handleClearSearch() {
    if (searchInputRef.current) searchInputRef.current.value = "";
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    removeQueryString("name", searchParams, router, pathname);
  }

  function handleMouseLeave() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: null }));
  }

  useEffect(() => {
    dispatch(fetchAllPlayers(paramsObject));
    setPaginationNumber(1);
  }, [searchParams]);

  useEffect(() => {
    checkAndLoadMoreData({
      playersData,
      paginationNumber,
      playersScroll,
      allDataDisplayed,
      pageVisits,
      dispatch,
    });
  }, [paginationNumber]);

  useEffect(() => {
    updateAllDataDisplayedStatus({
      playersData,
      paginationNumber,
      dispatch,
    });
  }, [playersScroll]);

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeoutRef?.current);
    };
  }, []);

  return (
    <div className={s.playersContainer} onMouseLeave={handleMouseLeave}>
      <FiltersSection />

      {showNoPlayersUI && (
        <NoPlayersFound handleClearSearch={handleClearSearch} />
      )}

      {(loading || error) && (
        <PlayersLoadingError error={error} dispatch={dispatch} />
      )}

      {hasPlayers && !loading && !error && (
        <PlayersCardsSection
          playersScroll={playersScroll}
          allDataDisplayed={allDataDisplayed}
          lastPlayerRef={lastPlayerRef}
          searchByName={searchByName}
        />
      )}
    </div>
  );
};

export default PlayersPage;

function checkAndLoadMoreData({
  playersData,
  paginationNumber,
  playersScroll,
  allDataDisplayed,
  pageVisits,
  dispatch,
} = {}) {
  const isLastPage = getIsLastPagination(
    playersData,
    paginationNumber,
    PLAYERS_BATCH_SIZE,
  );
  const previousPage = pageVisits.at(-1);
  const cameFromDifferentPage = previousPage !== "/players";

  // In this case the handleShowAll() is invoked already
  const isSameArrayReference = playersScroll === playersData;

  const shouldLoadMoreData =
    !isLastPage &&
    !allDataDisplayed &&
    !isSameArrayReference &&
    !cameFromDifferentPage;

  if (shouldLoadMoreData)
    addDataOnScroll({
      playersData,
      paginationNumber,
      playersScroll,
      dispatch,
    });
}

function addDataOnScroll({
  playersData,
  paginationNumber,
  playersScroll,
  dispatch,
} = {}) {
  const paginationPlayersData = paginateData(
    playersData,
    paginationNumber,
    PLAYERS_BATCH_SIZE,
  );
  const value = playersScroll.concat(paginationPlayersData);

  dispatch(updatePlayersState({ key: "playersScroll", value }));
}

function updateAllDataDisplayedStatus({
  playersData,
  paginationNumber,
  dispatch,
} = {}) {
  const lastPlayersPagination = Math.ceil(
    playersData?.length / PLAYERS_BATCH_SIZE,
  );
  const isLastPagination = paginationNumber >= lastPlayersPagination;

  dispatch(
    updatePlayersState({
      key: "allDataDisplayed",
      value: isLastPagination,
    }),
  );
}
