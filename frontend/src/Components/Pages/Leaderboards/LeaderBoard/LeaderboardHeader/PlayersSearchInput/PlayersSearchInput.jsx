"use client";

import { paginateData, stripColorCodes } from "@/Functions/utils";
import { updateLeaderboardState } from "@/Redux/slices/leaderboardSlice";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayersSearchInput.module.scss";

const PlayersSearchInput = ({
  searchTerm,
  setSearchTerm,
  setPaginationNumber,
}) => {
  const { leaderboardData } = useSelector((s) => s.leaderboard);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    searchByPlayerName({
      searchTerm,
      leaderboardData,
      setPaginationNumber,
      dispatch,
    });
  }, [searchTerm, searchParams, leaderboardData]);

  return (
    <input
      type="text"
      role="search"
      className={s.searchInput}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default PlayersSearchInput;

function searchByPlayerName({
  searchTerm,
  leaderboardData,
  setPaginationNumber,
  dispatch,
} = {}) {
  if (searchTerm.length > 0) {
    const filteredPlayers = leaderboardData.filter((player) => {
      const playerNameLowerCase = player.PlayerName.toLowerCase();
      const cleanPlayerName = stripColorCodes(playerNameLowerCase);
      return cleanPlayerName.includes(searchTerm.toLowerCase());
    });

    dispatch(
      updateLeaderboardState({
        key: "leaderboardScroll",
        value: filteredPlayers,
      })
    );

    setPaginationNumber(1);
    return;
  }

  const value = paginateData(leaderboardData, 1);
  dispatch(updateLeaderboardState({ key: "leaderboardScroll", value }));
}
