"use client";

import { formatDate } from "@/lib/dateTime";
import Link from "next/link";
import { useSelector } from "react-redux";
import LimitedDataCard from "./LimitedDataCard/LimitedDataCard";
import s from "./PlayerInfo.module.scss";
import RoutesCard from "./RoutesCard/RoutesCard";

const PlayerInfo = () => {
  const { performanceStats, jumpScores } = useSelector((s) => s.playerProfile);

  const lastSeenText = getLastSeenText(performanceStats?.DaysSinceLastSeen);
  const oldestTop = performanceStats?.OldestTop;
  const lastSeen = formatLastSeen(jumpScores?.LastSeen);
  const finishDate = formatDate(oldestTop?.FinishDate, "N/A");
  const oldestTopFps = oldestTop?.FPS === "0" ? "Mix" : oldestTop?.FPS;

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
              <div className={s.infoSubtext}>Last seen: {lastSeen}</div>
            </div>

            {oldestTop && (
              <div className={s.infoItem}>
                <div className={s.infoLabel}>
                  <svg aria-hidden="true">
                    <use href="/icons-sprite.svg#trophy"></use>
                  </svg>
                  Oldest Top Run
                </div>

                <Link
                  href={`/map/${oldestTop.Cpid}`}
                  className={s.mapName}
                  title={oldestTop.MapName}
                >
                  {oldestTop.MapName}
                </Link>

                <div className={s.metaInfo}>
                  <span>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#star"></use>
                    </svg>
                    Rank #{oldestTop.Rank}
                  </span>

                  <span>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#gauge"></use>
                    </svg>
                    {oldestTopFps} FPS
                  </span>

                  <span>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#calendar"></use>
                    </svg>
                    {finishDate}
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
  if (!lastSeen) {
    return "Unknown";
  }

  const date = new Date(lastSeen);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return "Just now";
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  }

  return date.toLocaleDateString();
}

function getLastSeenText(daysSinceLastSeen) {
  if (daysSinceLastSeen === 0) {
    return "Today";
  }
  if (daysSinceLastSeen === 1) {
    return "Yesterday";
  }
  if (daysSinceLastSeen > 1) {
    return `${daysSinceLastSeen} days ago`;
  }

  return "Unknown";
}
