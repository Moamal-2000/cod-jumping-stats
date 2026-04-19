"use client";

import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import {
  PAGINATION_ITEMS_PER_PAGE,
  TOTAL_MAPS_PLACEHOLDER,
} from "@/data/constants";
import { getFilteredLeaderboard, paginateData } from "@/lib/filters";
import { stripColorCodes } from "@/lib/utils";
import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
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
  const normalizedCountryNames = comboboxCountryNames(allLeaderboardData);

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
          Showing <span>{displayedPlayers}</span> of <span>{totalPlayers}</span>{" "}
          players • <span>{totalMaps}</span> total maps available
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

function comboboxCountryNames(allLeaderboardData) {
  const uniqueCountryNames = [
    ...new Set(allLeaderboardData.map((player) => player.Country)),
  ];

  return uniqueCountryNames.reduce((acc, country) => {
    if (!country || country === "N/A") {
      return acc;
    }

    const hasParentheses = new RegExp("[()]").test(country);
    const baseCountryName = country.slice(0, country.indexOf("(") - 1);
    const normalizedCountry = hasParentheses ? baseCountryName : country;

    const count = allLeaderboardData.reduce((acc, player) => {
      if (player.Country === country) {
        acc += 1;
      }
      return acc;
    }, 0);

    const countryObject = {
      value: normalizedCountry.toLowerCase(),
      label: normalizedCountry,
      id: country,
      count,
    };

    return [...acc, countryObject];
  }, []);
}
