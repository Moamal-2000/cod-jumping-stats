"use client";

import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./HideLeaderboardHeaderBtn.module.scss";

const HideLeaderboardHeaderBtn = () => {
  const { isLeaderboardHeaderVisible, loading, error, leaderboardData } =
    useSelector((s) => s.leaderboard);
  const isLeaderboardExpanded = useSelector(
    (s) => s.global.isLeaderboardExpanded,
  );
  const dispatch = useDispatch();

  const isLeaderboardUnavailable =
    loading || error || leaderboardData?.length === 0;

  function handleToggleHeader() {
    const value = !isLeaderboardHeaderVisible;

    dispatch(
      updateLeaderboardState({ key: "isLeaderboardHeaderVisible", value }),
    );
    localStorage.setItem("isLeaderboardHeaderVisible", value);
  }

  return (
    <button
      type="button"
      className={`${s.button} ${!isLeaderboardHeaderVisible ? s.active : ""}`}
      disabled={isLeaderboardUnavailable || !isLeaderboardExpanded}
      onClick={handleToggleHeader}
    >
      <svg aria-hidden="true">
        <use
          href={`/icons-sprite.svg#${isLeaderboardHeaderVisible ? "eye" : "eye-slash"}`}
        />
      </svg>
    </button>
  );
};

export default HideLeaderboardHeaderBtn;
