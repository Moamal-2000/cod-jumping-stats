"use client";

import { getLeaderboardConfig } from "@/data/leaderboardsConfig";
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

  const leaderboardType = searchParams.get("leaderboard") || "speedrun";
  const leaderboardConfig = getLeaderboardConfig(leaderboardType, isJ4lServer);

  return (
    <thead
      className={`${s.thead} ${
        isLeaderboardHeaderVisible ? "" : s.afterHideHeader
      }`}
    >
      <tr>
        {leaderboardConfig.columns.map(({ key, label, dataHeader }) => {
          if (key === "rank") {
            return <RankTableHeader key={key} text={label} />;
          }

          if (key === "j4lRank") {
            return (
              <th key={key} className={s.j4lRank}>
                {label}
              </th>
            );
          }

          if (key === "totalXp") {
            return (
              <th
                key={key}
                className={`${s.totalXp} ${!isLeaderboardHeaderVisible ? s.afterHideHeader : ""}`}
              >
                {label}
              </th>
            );
          }

          const cellClassName =
            key === "level" ? s.level : key === "rating" ? s.rating : s[key];

          return (
            <th key={key} className={cellClassName} data-header={dataHeader}>
              {label}
            </th>
          );
        })}
      </tr>

      {!isLeaderboardHeaderVisible && <HideLeaderboardHeaderBtn />}
    </thead>
  );
};

export default LeaderBoardTHead;
