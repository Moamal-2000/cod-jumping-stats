"use client";

import { formatDate } from "@/Functions/utils";
import { useSelector } from "react-redux";
import s from "./PlayerInfo.module.scss";

const PlayerInfo = () => {
  const { performanceStats, jumpScores } = useSelector((s) => s.playerProfile);

  function formatLastSeen(lastSeen) {
    if (!lastSeen) return "Unknown";

    try {
      const date = new Date(lastSeen);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return date.toLocaleDateString();
    } catch {
      return lastSeen;
    }
  }

  function getCompletionRateInfo(completionRate) {
    if (completionRate >= 95)
      return {
        class: "highlight",
        gradient: "linear-gradient(90deg, #f59e0b, #f97316)",
      };
    if (completionRate >= 85)
      return {
        class: "highlight",
        gradient: "linear-gradient(90deg, #8b5cf6, #a855f7)",
      };
    if (completionRate >= 70)
      return {
        class: "highlight",
        gradient: "linear-gradient(90deg, #3b82f6, #6366f1)",
      };
    if (completionRate >= 50)
      return {
        class: "highlight",
        gradient: "linear-gradient(90deg, #10b981, #14b8a6)",
      };
    if (completionRate >= 25)
      return {
        class: "highlight",
        gradient: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
      };
    return { class: "" };
  }

  return (
    <div className={s.playerStatsOverview}>
      <div className={s.statsHeader}>
        <h2>Player Information</h2>
      </div>

      <div className={s.playerInfoContainer}>
        {performanceStats ? (
          <div className={s.infoGrid}>
            <div className={s.infoItem}>
              <div className={s.infoLabel}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#flag"></use>
                </svg>
                Routes Completed
              </div>
              <div
                className={`${s.infoValue} ${
                  getCompletionRateInfo(
                    performanceStats.MapsCompletedRatio * 100
                  ).class
                }`}
              >
                {performanceStats.TotalMapsCompleted.toLocaleString()}
              </div>
              <div className={`${s.infoSubtext} ${s.highlight}`}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#check-circle"></use>
                </svg>
                {Math.round(performanceStats.MapsCompletedRatio * 100)}%
                completion rate
              </div>
              <div className={s.progressBar}>
                <div
                  className={s.progressBarFill}
                  style={{
                    width: `${performanceStats.MapsCompletedRatio * 100}%`,
                    background:
                      getCompletionRateInfo(
                        performanceStats.MapsCompletedRatio * 100
                      ).gradient || "var(--accent-color)",
                  }}
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
        ) : (
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
