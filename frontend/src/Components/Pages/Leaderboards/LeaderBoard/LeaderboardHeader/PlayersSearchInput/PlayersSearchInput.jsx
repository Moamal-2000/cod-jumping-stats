"use client";

import { paginateData, stripColorCodes } from "@/Functions/utils";
import { updateLeaderboardState } from "@/Redux/slices/leaderboardSlice";
import { updateSearchState } from "@/Redux/slices/searchSlice";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayersSearchInput.module.scss";

const PlayersSearchInput = ({ setPaginationNumber }) => {
  const { leaderboardData } = useSelector((s) => s.leaderboard);
  const { searchPlayer } = useSelector((s) => s.search);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    searchByPlayerName({
      searchPlayer,
      leaderboardData,
      setPaginationNumber,
      dispatch,
    });
  }, [searchPlayer, searchParams, leaderboardData]);

  return (
    <input
      type="text"
      role="search"
      className={s.searchInput}
      value={searchPlayer}
      onChange={(event) =>
        dispatch(
          updateSearchState({ key: "searchPlayer", value: event.target.value })
        )
      }
    />
  );
};

export default PlayersSearchInput;

function searchByPlayerName({
  searchPlayer,
  leaderboardData,
  setPaginationNumber,
  dispatch,
} = {}) {
  if (searchPlayer.length > 0) {
    const filteredPlayers = leaderboardData.filter((player) => {
      const playerNameLowerCase = player.PlayerName.toLowerCase();
      const cleanPlayerName = stripColorCodes(playerNameLowerCase);
      return cleanPlayerName.includes(searchPlayer.toLowerCase());
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
