"use client";

import { stripColorCodes } from "@/Functions/utils";
import { updateLeaderboardState } from "@/Redux/slices/leaderboardSlice";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayersSearchInput.module.scss";

const PlayersSearchInput = ({ searchTerm, setSearchTerm }) => {
  const { leaderboardData, leaderboardScroll } = useSelector(
    (s) => s.leaderboard
  );
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    searchByPlayerName({
      searchTerm,
      leaderboardData,
      leaderboardScroll,
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
  leaderboardScroll,
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

    return;
  }

  dispatch(
    updateLeaderboardState({
      key: "leaderboardScroll",
      value: leaderboardScroll,
    })
  );
}
