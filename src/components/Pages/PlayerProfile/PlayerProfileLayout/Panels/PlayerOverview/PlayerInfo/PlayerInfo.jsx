"use client";

import { formatDate } from "@/lib/dateTime";
import Link from "next/link";
import { useSelector } from "react-redux";
import LimitedDataCard from "./LimitedDataCard/LimitedDataCard";
import s from "./PlayerInfo.module.scss";
import RoutesCard from "./RoutesCard/RoutesCard";

const PlayerInfo = () => {
  const { performanceStats, jumpScores } = useSelector((s) => s.playerProfile);

  const lastSeenText = getLastSeenText(performanceStats.DaysSinceLastSeen);

  return (
    <section className={s.overview}>
      <div className={s.statsHeader}>
        <h2>Player Information</h2>
      </div>

      <div className={s.infoContainer}>
        {performanceStats && (
          <div className={s.infoGrid}>
            <RoutesCard performanceStats={performanceStats} />

            <div className={s.infoItem}>
              <div className={s.infoLabel}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#timer"></use>
                </svg>
                Last Active
              </div>
              <div className={s.infoValue}>{lastSeenText}</div>
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

                <Link
                  href={`/map/${performanceStats.OldestTop.Cpid}`}
                  className={s.mapName}
                  title={performanceStats.OldestTop.MapName}
                >
                  {performanceStats.OldestTop.MapName}
                </Link>

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

        {!performanceStats && <LimitedDataCard />}
      </div>
    </section>
  );
};

export default PlayerInfo;

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

function getLastSeenText(daysSinceLastSeen) {
  if (daysSinceLastSeen === 0) return "Today";
  if (daysSinceLastSeen === 1) return "Yesterday";
  if (daysSinceLastSeen > 1) return `${daysSinceLastSeen} days ago`;

  return "Unknown";
}
