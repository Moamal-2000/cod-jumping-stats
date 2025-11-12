"use client";

import { paginateData, stripColorCodes } from "@/functions/utils";
import { updateLeaderboardState } from "@/redux/slices/leaderboardSlice";
import { updateSearchState } from "@/redux/slices/searchSlice";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayersSearchInput.module.scss";

const PlayersSearchInput = ({ setPaginationNumber }) => {
  const { leaderboardData } = useSelector((s) => s.leaderboard);
  const { searchPlayer } = useSelector((s) => s.search);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  function handleChange(event) {
    dispatch(
      updateSearchState({ key: "searchPlayer", value: event.target.value })
    );
  }

  function handleClearSearch() {
    dispatch(updateSearchState({ key: "searchPlayer", value: "" }));
  }

  useEffect(() => {
    searchByPlayerName({
      searchPlayer,
      leaderboardData,
      setPaginationNumber,
      dispatch,
    });
  }, [searchPlayer, searchParams, leaderboardData]);

  return (
    <div className={s.searchContainer}>
      <input
        type="text"
        className={s.searchInput}
        placeholder="Search by player name..."
        value={searchPlayer}
        onChange={handleChange}
      />

      <button
        onClick={handleClearSearch}
        className={s.clearButton}
        title="Clear search"
      >
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#xMark" />
        </svg>
      </button>
    </div>
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
