"use client";

import { getModifiedRank } from "@/components/Helper/rankBadge";
import ToolTip from "@/components/Pages/PlayersPage/PlayerCard/ToolTip";
import { getPrestigeImage, rankImages } from "@/data/j4lRanksImages";
import Image from "next/image";
import PlayerNameCell from "./PlayerNameCell/PlayerNameCell";
import s from "./PlayerRow.module.scss";
import TopsCell from "./TopsCell/TopsCell";

export const RANK_PLACEHOLDER_PATH =
  "/assets/placeholders/j4l-rank-placeholder.png";

const PlayerRow = ({
  playerData,
  leaderboardData,
  lastPlayerRef,
  isRoutesCompleted,
  isJ4lServer,
  isXpRank,
  index,
}) => {
  const {
    Rating,
    Score,
    TopList,
    Title,
    Rank,
    Prestige,
    Level,
    TotalXP,
    XPForLevel,
    XPIntoLevel,
  } = playerData;

  const lastRowRef =
    leaderboardData.length === index + 1 ? lastPlayerRef : null;

  return (
    <tr className={s.playerRow} ref={lastRowRef} data-type="player-stats-row">
      <td className={s.rank} data-header="Rank">
        {getModifiedRank(Rank)}
      </td>

      {isJ4lServer && (
        <td className={s.j4lRank} data-header="J4L Rank">
          <div className={s.rankImgWrapper}>
            <Image
              src={getRankSrc({ Prestige, Level })}
              alt={Level ? `${Title} rank badge` : "Rank placeholder"}
              width={128}
              height={128}
              quality={100}
            />
            <ToolTip centerPosition bottom={54}>
              {Level ? `Level ${Level} ${Title}` : "Unknown Rank"}
            </ToolTip>
          </div>
        </td>
      )}

      <PlayerNameCell playerData={playerData} index={index} />

      <td
        className={s[isXpRank ? "level" : "rating"]}
        data-header={isXpRank ? "Level" : "Rating"}
      >
        {isXpRank ? `${Level} / 50` : (+Rating).toFixed(2)}
      </td>

      <td
        className={s[isXpRank ? "levelProgress" : "score"]}
        data-header={
          isRoutesCompleted
            ? "Completed routes"
            : isXpRank
              ? "Next Level Progress"
              : "Points"
        }
      >
        {isXpRank ? (
          <div className={s.xpContainer}>
            <div className={s.progressBarWrapper}>
              <div className={s.xpText}>
                <span>{XPIntoLevel?.toLocaleString()} XP</span>
                <span>{XPForLevel?.toLocaleString()} XP</span>
              </div>
              <progress
                max={XPForLevel}
                value={XPIntoLevel}
                className={s.xpProgressBar}
              />
            </div>
          </div>
        ) : (
          Score
        )}
      </td>

      {!isRoutesCompleted && !isXpRank && (
        <TopsCell topList={TopList} leaderboardData={leaderboardData} />
      )}

      {isXpRank && (
        <td className={s.totalXp} data-header="Total XP">
          {TotalXP?.toLocaleString()}
          <sup>XP</sup>
        </td>
      )}
    </tr>
  );
};

export default PlayerRow;

function getRankImage({ Prestige, Level }) {
  if (Prestige > 0) {
    return getPrestigeImage(Prestige);
  }

  return rankImages.find((rank) =>
    rank.level
      ? rank.level === Level
      : Level >= rank.minLevel && Level <= rank.maxLevel,
  )?.image;
}

function getRankSrc({ Prestige, Level }) {
  if (isSafeNumber(Prestige) && isSafeNumber(Level)) {
    return `/assets/j4lRanks/${getRankImage({ Prestige, Level })}`;
  }

  return RANK_PLACEHOLDER_PATH;
}

function isSafeNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    !Array.isArray(value) &&
    Number.isFinite(Number(value))
  );
}
