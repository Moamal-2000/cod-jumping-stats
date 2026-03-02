"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import HideLeaderboardHeaderBtn from "../LeaderboardHeader/LeaderboardHeaderBtns/HideLeaderboardHeaderBtn/HideLeaderboardHeaderBtn";
import s from "./LeaderBoardTHead.module.scss";
import RankTableHeader from "./RankTableHeader/RankTableHeader";

const LeaderBoardTHead = () => {
  const isLeaderboardHeaderVisible = useSelector(
    (s) => s.leaderboard.isLeaderboardHeaderVisible,
  );

  const searchParams = useSearchParams();

  const leaderboardType = searchParams.get("leaderboard");
  const isSkilledLeaderboard = leaderboardType === "skilled";
  const isRoutesCompleted = leaderboardType === "routescompleted";
  const scoreText = isRoutesCompleted ? "Completed routes" : "Points";

  return (
    <thead
      className={`${s.thead} ${
        isLeaderboardHeaderVisible ? "" : s.afterHideHeader
      }`}
    >
      <tr>
        <RankTableHeader text="Rank" />
        <th className={s.player}>Player</th>
        <th className={s.rating}>Rating</th>
        <th className={s.score} data-header={scoreText}>
          {scoreText}
        </th>

        {!isRoutesCompleted && (
          <th className={s.tops}>
            {isSkilledLeaderboard ? "Points per difficulty" : "Tops 1-10"}
            {!isLeaderboardHeaderVisible && <HideLeaderboardHeaderBtn />}
          </th>
        )}

        {isRoutesCompleted && !isLeaderboardHeaderVisible && (
          <th className={`${s.tops} ${s.afterHideHeader}`}>
            <HideLeaderboardHeaderBtn />
          </th>
        )}
      </tr>
    </thead>
  );
};

export default LeaderBoardTHead;
