"use client";

import { updateLeaderboardState } from "@/redux/features/leaderboard/slice/leaderboardSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./HideLeaderboardHeaderBtn.module.scss";

const HideLeaderboardHeaderBtn = () => {
  const { isLeaderboardHeaderVisible } = useSelector((s) => s.leaderboard);
  const dispatch = useDispatch();

  function handleToggleHeader() {
    const value = !isLeaderboardHeaderVisible;

    dispatch(
      updateLeaderboardState({ key: "isLeaderboardHeaderVisible", value })
    );
    localStorage.setItem("isLeaderboardHeaderVisible", value);
  }

  return (
    <button type="button" className={s.button} onClick={handleToggleHeader}>
      {isLeaderboardHeaderVisible ? "Hide" : "Show"} Header
    </button>
  );
};

export default HideLeaderboardHeaderBtn;
