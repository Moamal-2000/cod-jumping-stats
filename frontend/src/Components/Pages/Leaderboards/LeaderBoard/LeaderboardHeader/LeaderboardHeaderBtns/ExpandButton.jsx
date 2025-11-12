"use client";

import { updateGlobalState } from "@/redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";

const ExpandButton = () => {
  const { loading, error, leaderboardData } = useSelector((s) => s.leaderboard);
  const { isLeaderboardExpanded } = useSelector((s) => s.global);

  const dispatch = useDispatch();
  const isLeaderboardUnavailable =
    loading || error || leaderboardData?.length === 0;

  function handleExpandBtn() {
    dispatch(
      updateGlobalState({
        key: "isLeaderboardExpanded",
        value: !isLeaderboardExpanded,
      })
    );
  }

  return (
    <button
      type="button"
      onClick={handleExpandBtn}
      disabled={isLeaderboardUnavailable}
    >
      {isLeaderboardExpanded ? "Minimize" : "Maximize"}
    </button>
  );
};

export default ExpandButton;
