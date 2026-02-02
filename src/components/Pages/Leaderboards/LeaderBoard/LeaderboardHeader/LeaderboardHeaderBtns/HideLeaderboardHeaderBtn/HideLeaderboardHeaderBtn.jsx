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

  const disableButton = shouldDisableButton({
    loading,
    error,
    leaderboardData,
    isLeaderboardExpanded,
  });

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
      disabled={disableButton}
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

function shouldDisableButton({
  loading,
  error,
  leaderboardData,
  isLeaderboardExpanded,
} = {}) {
  const isLeaderboardUnavailable =
    loading || error || leaderboardData?.length === 0;

  const isViewportBelow1300px = matchMedia("(max-width: 1300px)").matches;

  return (
    isLeaderboardUnavailable || !isLeaderboardExpanded || isViewportBelow1300px
  );
}
