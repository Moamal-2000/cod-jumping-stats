"use client";

import { getModifiedRank } from "@/components/Helper/rankBadge";
import { useSearchParams } from "next/navigation";
import PlayerNameCell from "./PlayerNameCell/PlayerNameCell";
import s from "./PlayerRow.module.scss";
import TopsCell from "./TopsCell/TopsCell";

const PlayerRow = ({ playerData, leaderboardData, lastPlayerRef, index }) => {
  const { Rating, Score, TopList, Rank } = playerData;
  const modifiedRank = getModifiedRank(Rank);
  const ref = leaderboardData.length === index + 1 ? lastPlayerRef : null;
  const searchParams = useSearchParams();
  const isRoutesCompleted =
    searchParams.get("leaderboard") === "routescompleted";

  return (
    <tr className={s.playerRow} ref={ref} data-type="player-stats-row">
      <td className={s.rank} data-header="Rank">
        {modifiedRank}
      </td>

      <PlayerNameCell playerData={playerData} />

      <td className={s.rating} data-header="Rating">
        {(+Rating).toFixed(2)}
      </td>

      <td
        className={s.score}
        data-header={isRoutesCompleted ? "Completed routes" : "Points"}
      >
        {Score}
      </td>

      {!isRoutesCompleted && (
        <TopsCell topList={TopList} leaderboardData={leaderboardData} />
      )}
    </tr>
  );
};

export default PlayerRow;
