"use client";

import useInfiniteScroll from "@/hooks/app/useInfiniteScroll";
import { getIsLastPagination, paginateData } from "@/lib/filters";
import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { fetchLeaderboard } from "@/redux/features/leaderboard/thunk/leaderboardThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./LeaderBoard.module.scss";
import LeaderboardHeader from "./LeaderboardHeader/LeaderboardHeader";
import LeaderBoardTBody from "./LeaderBoardTBody/LeaderBoardTBody";
import LeaderBoardTHead from "./LeaderBoardTHead/LeaderBoardTHead";

const LeaderBoard = () => {
  const { leaderboardData, leaderboardScroll, allDataDisplayed } = useSelector(
    (s) => s.leaderboard,
  );
  const {
    tryFetchAgain,
    isLeaderboardReversed,
    isLeaderboardExpanded,
    pageVisits,
  } = useSelector((s) => s.global);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  const searchQuery = searchParams.get("query") || "";
  const sourceParam = searchParams.get("source") || "jh";
  const isJ4lServer = sourceParam === "j4l";

  const collapseClass = isLeaderboardExpanded ? "" : s.collapse;
  const leaderboardClasses = getLeaderboardClasses({
    cssModule: s,
    searchParams,
  });

  const [lastPlayerRef, paginationNumber, setPaginationNumber] =
    useInfiniteScroll(leaderboardData, isLeaderboardReversed);

  function getLeaderboardData() {
    dispatch(fetchLeaderboard(paramsObject));
    setPaginationNumber(1);
  }

  useEffect(() => {
    getLeaderboardData();
  }, [searchParams, tryFetchAgain]);

  useEffect(() => {
    const searchHasValue = searchQuery.length > 0;

    checkAndLoadMoreData({
      leaderboardData,
      paginationNumber,
      leaderboardScroll,
      allDataDisplayed,
      isLeaderboardExpanded,
      isLeaderboardReversed,
      searchHasValue,
      pageVisits,
      dispatch,
    });
  }, [paginationNumber, isLeaderboardReversed]);

  return (
    <div className={`${s.leaderboardWrapper} ${collapseClass}`}>
      <LeaderboardHeader
        paginationNumber={paginationNumber}
        setPaginationNumber={setPaginationNumber}
      />

      <table className={leaderboardClasses}>
        <LeaderBoardTHead isJ4lServer={isJ4lServer} />
        <LeaderBoardTBody
          leaderboardData={leaderboardScroll}
          lastPlayerRef={lastPlayerRef}
          isJ4lServer={isJ4lServer}
        />
      </table>
    </div>
  );
};

export default LeaderBoard;

function checkAndLoadMoreData({
  leaderboardData,
  paginationNumber,
  leaderboardScroll,
  allDataDisplayed,
  isLeaderboardExpanded,
  isLeaderboardReversed,
  searchHasValue,
  pageVisits,
  dispatch,
} = {}) {
  if (isLeaderboardReversed) {
    dispatch(
      updateLeaderboardState({
        key: "leaderboardScroll",
        value: leaderboardData,
      }),
    );
    return;
  }

  const isLastPagination = getIsLastPagination(
    leaderboardData,
    paginationNumber,
  );

  // In this case the handleShowAll() is invoked already
  const isSameArrayReference = leaderboardScroll === leaderboardData;

  const previousPage = pageVisits.at(-1);
  const cameFromDifferentPage = previousPage !== "/leaderboards";

  const shouldShowMoreData =
    !isLastPagination &&
    !isSameArrayReference &&
    !allDataDisplayed &&
    isLeaderboardExpanded &&
    !cameFromDifferentPage &&
    !searchHasValue;

  if (shouldShowMoreData) {
    addDataOnScroll({
      leaderboardData,
      paginationNumber,
      leaderboardScroll,
      dispatch,
    });
  }
}

function addDataOnScroll({
  leaderboardData,
  paginationNumber,
  leaderboardScroll,
  dispatch,
} = {}) {
  const paginationLeaderboardData = paginateData(
    leaderboardData,
    paginationNumber,
  );
  const value = leaderboardScroll.concat(paginationLeaderboardData);

  dispatch(updateLeaderboardState({ key: "leaderboardScroll", value }));
}

function getLeaderboardClasses({ cssModule, searchParams }) {
  const leaderboardType = searchParams.get("leaderboard");
  const isXpRank = leaderboardType === "rankxp";
  const isRoutesCompleted = leaderboardType === "routescompleted";
  const isJ4lServer = searchParams.get("source") === "j4l";

  return [
    cssModule.leaderBoard,
    isRoutesCompleted ? cssModule.routesCompleted : "",
    isJ4lServer ? cssModule.j4lServer : "",
    isXpRank ? cssModule.xpRank : "",
  ]
    .filter(Boolean)
    .join(" ");
}
