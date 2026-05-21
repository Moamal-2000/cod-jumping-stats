"use client";

import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import ResultsSummary from "@/components/Shared/Texts/ResultsSummary/ResultsSummary";
import {
  PAGINATION_ITEMS_PER_PAGE,
  TOTAL_MAPS_PLACEHOLDER,
} from "@/data/constants";
import {
  comboboxCountryNames,
  getFilteredLeaderboard,
  paginateData,
} from "@/lib/filters";
import { stripColorCodes } from "@/lib/utils";
import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./LeaderboardHeader.module.scss";
import LeaderboardHeaderBtns from "./LeaderboardHeaderBtns/LeaderboardHeaderBtns";

const LeaderboardHeader = ({ paginationNumber, setPaginationNumber }) => {
  const {
    allLeaderboardData,
    leaderboardData,
    leaderboardScroll,
    isLeaderboardHeaderVisible,
  } = useSelector((s) => s.leaderboard);
  const allMaps = useSelector((s) => s.maps.allMaps);
  const statistics = useSelector((s) => s.global.statistics);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const isLastSeenLeader = !!searchParams.get("last-seen");

  const leaderboardTitle = isLastSeenLeader
    ? "Last Seen Players"
    : "Top Players";
  const totalPlayers = leaderboardData?.length || 0;
  const displayedPlayers = leaderboardScroll?.length || 0;

  const totalMaps =
    statistics?.mapsCount || allMaps?.length || TOTAL_MAPS_PLACEHOLDER;
  const normalizedCountryNames = comboboxCountryNames({
    allData: allLeaderboardData,
  });

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
    filterLeaderboardByParams({
      allLeaderboardData,
      leaderboardData,
      paramsObject: Object.fromEntries(new URLSearchParams(searchParamsString)),
      dispatch,
      setPaginationNumber,
    });

    if (allMaps?.length === 0) {
      dispatch(fetchMaps());
    }
  }, [allLeaderboardData, leaderboardData, searchParamsString]);

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

          <ComboBox
            queryName="country"
            options={normalizedCountryNames}
            placeholder="Search by country name..."
            orderByCount
          />
        </div>

        <p>
          <ResultsSummary
            displayCount={displayedPlayers}
            total={totalPlayers}
            label="players"
            as={React.Fragment}
          />{" "}
          • <b>{totalMaps}</b> total maps available
        </p>
      </div>

      <LeaderboardHeaderBtns setPaginationNumber={setPaginationNumber} />
    </header>
  );
};

export default LeaderboardHeader;

function filterLeaderboardByParams({
  allLeaderboardData,
  leaderboardData,
  paramsObject,
  dispatch,
  setPaginationNumber,
} = {}) {
  const searchQuery = paramsObject?.query || "";
  const selectedCountry = paramsObject?.country || "";
  let filteredPlayers = getFilteredLeaderboard(
    allLeaderboardData,
    paramsObject,
  );

  if (searchQuery.length > 0) {
    filteredPlayers = searchByPlayerName({ searchQuery, filteredPlayers });
  }

  if (selectedCountry.length > 0) {
    filteredPlayers = searchByCountryName({
      selectedCountry,
      filteredPlayers,
    });
  }

  const isChanged = !isSameLeaderboard(filteredPlayers, leaderboardData);
  const value = paginateData(filteredPlayers, 1);

  if (isChanged) {
    dispatch(
      updateLeaderboardState({
        key: "leaderboardData",
        value: filteredPlayers,
      }),
    );
  }

  dispatch(updateLeaderboardState({ key: "leaderboardScroll", value }));
  setPaginationNumber(1);
}

function searchByPlayerName({ searchQuery, filteredPlayers } = {}) {
  return filteredPlayers.filter((player) => {
    const playerNameLowerCase = player.PlayerName.toLowerCase();
    const cleanPlayerName = stripColorCodes(playerNameLowerCase);
    return cleanPlayerName.includes(searchQuery.toLowerCase());
  });
}

function searchByCountryName({ selectedCountry, filteredPlayers }) {
  return filteredPlayers.filter((player) => {
    return player.Country.toLowerCase().includes(selectedCountry.toLowerCase());
  });
}

function isSameLeaderboard(nextLeaderboard = [], currentLeaderboard = []) {
  if (nextLeaderboard.length !== currentLeaderboard.length) {
    return false;
  }

  return nextLeaderboard.every(
    (player, index) => player.PlayerID === currentLeaderboard[index]?.PlayerID,
  );
}
