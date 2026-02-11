"use client";

import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import {
  PAGINATION_ITEMS_PER_PAGE,
  TOTAL_MAPS_PLACEHOLDER,
} from "@/data/constants";
import { paginateData, stripColorCodes } from "@/functions/utils";
import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./LeaderboardHeader.module.scss";
import LeaderboardHeaderBtns from "./LeaderboardHeaderBtns/LeaderboardHeaderBtns";

const LeaderboardHeader = ({ paginationNumber, setPaginationNumber }) => {
  const { leaderboardData, leaderboardScroll, isLeaderboardHeaderVisible } =
    useSelector((s) => s.leaderboard);
  const statistics = useSelector((s) => s.global.statistics);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isLastSeenLeader = !!searchParams.get("last-seen");
  const searchQuery = searchParams.get("query") || "";

  const leaderboardTitle = isLastSeenLeader
    ? "Last Seen Players"
    : "Top Players";
  const totalPlayers = leaderboardData?.length || 0;
  const displayedPlayers = leaderboardScroll?.length || 0;

  const totalMaps = statistics?.mapsCount || TOTAL_MAPS_PLACEHOLDER;

  function updateAllDataDisplayedStatus() {
    const lastLeaderboardPagination = Math.ceil(
      leaderboardData?.length / PAGINATION_ITEMS_PER_PAGE,
    );
    const isLastPagination = paginationNumber >= lastLeaderboardPagination;

    dispatch(
      updateLeaderboardState({
        key: "allDataDisplayed",
        value: isLastPagination,
      }),
    );
  }

  useEffect(() => {
    searchByPlayerName({
      searchQuery,
      leaderboardData,
      setPaginationNumber,
      dispatch,
    });
  }, [leaderboardData]);

  useEffect(() => {
    updateAllDataDisplayedStatus();
  }, [leaderboardScroll]);

  return (
    <header
      className={`${s.header} ${isLeaderboardHeaderVisible ? "" : s.hidden}`}
    >
      <div className={s.mainWrapper}>
        <div className={s.wrapper}>
          <h3>{leaderboardTitle}</h3>
          <SearchInput
            placeholder="Search by player name..."
            queryName="query"
            autoFocus={true}
          />
        </div>

        <p>
          Showing <span>{displayedPlayers}</span> of <span>{totalPlayers}</span>{" "}
          players • <span>{totalMaps}</span> total maps available
        </p>
      </div>

      <LeaderboardHeaderBtns setPaginationNumber={setPaginationNumber} />
    </header>
  );
};

export default LeaderboardHeader;

function searchByPlayerName({
  searchQuery,
  leaderboardData,
  setPaginationNumber,
  dispatch,
} = {}) {
  if (searchQuery.length > 0) {
    const filteredPlayers = leaderboardData.filter((player) => {
      const playerNameLowerCase = player.PlayerName.toLowerCase();
      const cleanPlayerName = stripColorCodes(playerNameLowerCase);
      return cleanPlayerName.includes(searchQuery.toLowerCase());
    });

    dispatch(
      updateLeaderboardState({
        key: "leaderboardScroll",
        value: filteredPlayers,
      }),
    );

    setPaginationNumber(1);
    return;
  }

  const value = paginateData(leaderboardData, 1);
  dispatch(updateLeaderboardState({ key: "leaderboardScroll", value }));
}
