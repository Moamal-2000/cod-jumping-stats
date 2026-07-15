"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import HideLeaderboardHeaderBtn from "../LeaderboardHeader/LeaderboardHeaderBtns/HideLeaderboardHeaderBtn/HideLeaderboardHeaderBtn";
import s from "./LeaderBoardTHead.module.scss";
import RankTableHeader from "./RankTableHeader/RankTableHeader";

const LeaderBoardTHead = ({ isJ4lServer }) => {
  const isLeaderboardHeaderVisible = useSelector(
    (s) => s.leaderboard.isLeaderboardHeaderVisible,
  );

  const searchParams = useSearchParams();

  const leaderboardType = searchParams.get("leaderboard");
  const isSkilledLeaderboard = leaderboardType === "skilled";
  const isRoutesCompleted = leaderboardType === "routescompleted";
  const isXpRank = leaderboardType === "rankxp";
  const scoreText = isRoutesCompleted
    ? "Completed routes"
    : isXpRank
      ? "Next Level Progress"
      : "Points";

  return (
    <thead
      className={`${s.thead} ${
        isLeaderboardHeaderVisible ? "" : s.afterHideHeader
      }`}
    >
      <tr>
        <RankTableHeader text="Rank" />
        {isJ4lServer && <th className={s.j4lRank}>J4L Rank</th>}
        <th className={s.player}>Player</th>
        <th className={s[isXpRank ? "level" : "rating"]}>
          {isXpRank ? "Level" : "Rating"}
        </th>
        <th className={s.score} data-header={scoreText}>
          {scoreText}
        </th>

        {!isRoutesCompleted && !isXpRank && (
          <th className={s.tops}>
            {isSkilledLeaderboard ? "Points per difficulty" : "Tops 1-10"}
          </th>
        )}

        {isXpRank && (
          <th
            className={`${s.totalXp} ${!isLeaderboardHeaderVisible ? s.afterHideHeader : ""}`}
          >
            Total XP
          </th>
        )}
      </tr>

      {!isLeaderboardHeaderVisible && <HideLeaderboardHeaderBtn />}
    </thead>
  );
};

export default LeaderBoardTHead;
