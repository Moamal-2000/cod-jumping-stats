"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./ExpandButton.module.scss";

const ExpandButton = () => {
  const { loading, error, leaderboardData } = useSelector((s) => s.leaderboard);
  const isLeaderboardExpanded = useSelector(
    (s) => s.global.isLeaderboardExpanded,
  );

  const dispatch = useDispatch();

  const isLeaderboardUnavailable =
    loading || error || leaderboardData?.length === 0;
  const title = isLeaderboardExpanded
    ? "Collapse leaderboard"
    : "Expand leaderboard";

  function handleExpandBtn() {
    dispatch(
      updateGlobalState({
        key: "isLeaderboardExpanded",
        value: !isLeaderboardExpanded,
      }),
    );
  }

  return (
    <button
      type="button"
      onClick={handleExpandBtn}
      className={`${s.button} ${!isLeaderboardExpanded ? s.active : ""}`}
      disabled={isLeaderboardUnavailable}
      aria-label={title}
      title={title}
    >
      <svg aria-hidden="true">
        <use
          href={`/icons-sprite.svg#${isLeaderboardExpanded ? "minus" : "plus"}`}
        />
      </svg>
    </button>
  );
};

export default ExpandButton;
