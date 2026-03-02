"use client";

import { getModifiedRank } from "@/components/Helper/rankBadge";
import PlayerNameCell from "./PlayerNameCell/PlayerNameCell";
import s from "./PlayerRow.module.scss";
import TopsCell from "./TopsCell/TopsCell";

const PlayerRow = ({
  playerData,
  leaderboardData,
  lastPlayerRef,
  isRoutesCompleted,
  index,
}) => {
  const { Rating, Score, TopList, Rank } = playerData;

  const lastRowRef =
    leaderboardData.length === index + 1 ? lastPlayerRef : null;

  return (
    <tr className={s.playerRow} ref={lastRowRef} data-type="player-stats-row">
      <td className={s.rank} data-header="Rank">
        {getModifiedRank(Rank)}
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
