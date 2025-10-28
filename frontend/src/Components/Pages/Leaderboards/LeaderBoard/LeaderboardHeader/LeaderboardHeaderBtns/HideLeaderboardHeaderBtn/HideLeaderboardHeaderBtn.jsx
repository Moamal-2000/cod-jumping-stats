"use client";

import { updateLeaderboardState } from "@/Redux/slices/leaderboardSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./HideLeaderboardHeaderBtn.module.scss";

const HideLeaderboardHeaderBtn = () => {
  const { isLeaderboardHeaderVisible } = useSelector((s) => s.leaderboard);
  const dispatch = useDispatch();

  function handleToggleLeaderboardHeader() {
    dispatch(
      updateLeaderboardState({
        key: "isLeaderboardHeaderVisible",
        value: !isLeaderboardHeaderVisible,
      })
    );
  }

  return (
    <button
      type="button"
      className={s.button}
      onClick={handleToggleLeaderboardHeader}
    >
      {isLeaderboardHeaderVisible ? "Hide" : "Show"} Header
    </button>
  );
};

export default HideLeaderboardHeaderBtn;
