"use client";

import { useSearchParams } from "next/navigation";
import TopStatBar from "./TopStatBar/TopStatBar";
import s from "./TopsVisualization.module.scss";

const TopsVisualization = ({ topsList, leaderboardData }) => {
  const maxFinishTimes = getMaxFinishTimesFrom(leaderboardData[0]);
  const topsEntries = Object.entries(topsList || {});
  const searchParams = useSearchParams();
  const isSkilledLeaderboard = searchParams.get("leaderboard") === "skilled";
  const modifiedTopsEntries = isSkilledLeaderboard
    ? topsEntries.toReversed()
    : topsEntries;

  return (
    <div className={s.tops}>
      {modifiedTopsEntries.map((topStat, index) => {
        return (
          <TopStatBar
            top={topStat[0]}
            times={topStat[1]}
            maxFinishTimes={maxFinishTimes}
            isSkilledLeaderboard={isSkilledLeaderboard}
            key={`stat-bar-${index}`}
          />
        );
      })}
    </div>
  );
};

export default TopsVisualization;

function getMaxFinishTimesFrom(bestPlayer) {
  const topList = bestPlayer?.TopList;
  if (topList === undefined || topList === null) return 0;

  return Math.max(...Object.values(topList));
}
