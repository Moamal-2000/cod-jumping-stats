"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./RankTableHeader.module.scss";

const RankTableHeader = ({ text }) => {
  const isLeaderboardReversed = useSelector(
    (s) => s.global.isLeaderboardReversed,
  );

  const dispatch = useDispatch();

  const ariaLabel = `Sort leaderboard by rank ${
    isLeaderboardReversed ? "descending" : "ascending"
  }`;

  function reverseLeaderboard() {
    dispatch(
      updateGlobalState({
        key: "isLeaderboardReversed",
        value: !isLeaderboardReversed,
      }),
    );
  }

  function handleKeyDown(event) {
    const isEnterKey = event.code === "Enter" && event.keyCode === 13;
    if (isEnterKey) {
      reverseLeaderboard();
    }
  }

  return (
    <th
      className={s.rank}
      data-sortable
      tabIndex="0"
      aria-label={ariaLabel}
      onClick={reverseLeaderboard}
      onKeyDown={handleKeyDown}
    >
      <span>{text}</span>
    </th>
  );
};

export default RankTableHeader;
