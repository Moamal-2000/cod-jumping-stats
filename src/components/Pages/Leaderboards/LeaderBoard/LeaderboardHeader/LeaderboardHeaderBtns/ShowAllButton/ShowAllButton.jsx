"use client";

import { PAGINATION_ITEMS_PER_PAGE } from "@/data/constants";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./ShowAllButton.module.scss";

const ShowAllButton = ({ setPaginationNumber }) => {
  const {
    leaderboardData,
    leaderboardScroll,
    firstChunkLeaderboard,
    allDataDisplayed,
    loading,
    error,
  } = useSelector((s) => s.leaderboard);
  const { isLeaderboardReversed } = useSelector((s) => s.global);
  const dispatch = useDispatch();
  const isLeaderboardUnavailable =
    loading || error || leaderboardData?.length === 0;
  const flipButton =
    leaderboardData?.length === 0 ? false : allDataDisplayed ? true : false;

  function handleShowAllBtn() {
    if (allDataDisplayed) {
      handleShowLess();
      return;
    }

    handleShowAll();
  }

  function handleShowAll() {
    if (leaderboardData?.length <= 0 || allDataDisplayed) return;

    const lastLeaderboardPagination = Math.ceil(
      leaderboardData?.length / PAGINATION_ITEMS_PER_PAGE,
    );

    dispatch(
      updateLeaderboardState({
        key: "leaderboardScroll",
        value: leaderboardData,
      }),
    );

    setPaginationNumber(lastLeaderboardPagination);
  }

  function handleShowLess() {
    if (leaderboardData?.length <= 0) return;

    dispatch(
      updateLeaderboardState({
        key: "leaderboardScroll",
        value: firstChunkLeaderboard,
      }),
    );
    dispatch(updateGlobalState({ key: "isLeaderboardReversed", value: false }));

    setPaginationNumber(1);
  }

  useEffect(() => {
    const isSameArrayReference = leaderboardScroll === leaderboardData;
    if (!isSameArrayReference) handleShowAll();
  }, [isLeaderboardReversed]);

  return (
    <button
      type="button"
      onClick={handleShowAllBtn}
      disabled={isLeaderboardUnavailable}
      className={`${s.button} ${flipButton ? s.active : ""}`}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#angles-down" />
      </svg>
    </button>
  );
};

export default ShowAllButton;
