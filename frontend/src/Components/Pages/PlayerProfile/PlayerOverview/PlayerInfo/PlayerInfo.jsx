"use client";

import { formatDate } from "@/Functions/utils";
import { useSelector } from "react-redux";
import s from "./PlayerInfo.module.scss";

const PlayerInfo = () => {
  const { performanceStats, jumpScores } = useSelector((s) => s.playerProfile);
  const completionRatio = (performanceStats?.MapsCompletedRatio || 0) * 100;

  return (
    <div className={s.playerStatsOverview}>
      <div className={s.statsHeader}>
        <h2>Player Information</h2>
      </div>

      <div className={s.playerInfoContainer}>
        {performanceStats && (
          <div className={s.infoGrid}>
            <div className={s.infoItem}>
              <div className={s.infoLabel}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#flag"></use>
                </svg>
                Routes Completed
              </div>
              <div className={s.infoValue}>
                {performanceStats.TotalMapsCompleted.toLocaleString()}
              </div>
              <div className={`${s.infoSubtext} ${s.highlight}`}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#check-circle"></use>
                </svg>
                {Math.round(completionRatio)}% completion rate
              </div>
              <div className={s.progressBar}>
                <div
                  className={`${s.progressBarFill} ${getCompletionRateClass(
                    completionRatio
                  )}`}
                  style={{ width: `${completionRatio}%` }}
                />
              </div>
            </div>

            <div className={s.infoItem}>
              <div className={s.infoLabel}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#timer"></use>
                </svg>
                Last Active
              </div>
              <div className={s.infoValue}>
                {performanceStats.DaysSinceLastSeen === 0
                  ? "Today"
                  : performanceStats.DaysSinceLastSeen === 1
                  ? "Yesterday"
                  : `${performanceStats.DaysSinceLastSeen} days ago`}
              </div>
              <div className={s.infoSubtext}>
                Last seen: {formatLastSeen(jumpScores?.LastSeen)}
              </div>
            </div>

            {performanceStats?.OldestTop && (
              <div className={s.infoItem}>
                <div className={s.infoLabel}>
                  <svg aria-hidden="true">
                    <use href="/icons-sprite.svg#trophy"></use>
                  </svg>
                  Oldest Top Run
                </div>
                <div
                  className={s.mapName}
                  title={performanceStats.OldestTop.MapName}
                >
                  {performanceStats.OldestTop.MapName}
                </div>
                <div className={s.metaInfo}>
                  <span>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#star"></use>
                    </svg>
                    Rank #{performanceStats.OldestTop.Rank}
                  </span>
                  <span>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#gauge"></use>
                    </svg>
                    {performanceStats.OldestTop.FPS} FPS
                  </span>
                  <span>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#calendar"></use>
                    </svg>
                    {formatDate(performanceStats.OldestTop.FinishDate, "N/A")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {!performanceStats && (
          <div className={s.mainInfoCard}>
            <div className={s.infoGrid}>
              <div className={s.infoItem}>
                <div className={s.infoLabel}>
                  <svg aria-hidden="true">
                    <use href="/icons-sprite.svg#chart-bar"></use>
                  </svg>
                  Player Data
                </div>
                <div className={s.infoValue}>Limited Data Available</div>
                <div className={s.infoSubtext}>
                  This player has insufficient data for detailed statistics
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;

function getCompletionRateClass(completionRate) {
  if (completionRate >= 95) return s[`highlight-95`];
  if (completionRate >= 70) return s[`highlight-70`];
  if (completionRate >= 50) return s[`highlight-50`];
  if (completionRate >= 25) return s[`highlight-25`];

  return "";
}

function formatLastSeen(lastSeen) {
  if (!lastSeen) return "Unknown";

  const date = new Date(lastSeen);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

  return date.toLocaleDateString();
}
