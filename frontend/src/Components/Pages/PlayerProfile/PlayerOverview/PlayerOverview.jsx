"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import PlayerInfo from "./PlayerInfo/PlayerInfo";
import s from "./PlayerOverview.module.scss";
import TopRunsPerFps from "./TopRunsPerFps/TopRunsPerFps";

const PlayerOverview = () => {
  const performanceStats = useSelector((s) => s.playerProfile.performanceStats);
  const topRunsCount = performanceStats?.RecentTops?.length;

  return (
    <div className={s.tabContent}>
      <div className={s.overviewTab}>
        <PlayerInfo />
        <TopRunsPerFps />

        {/* Recent Activity */}
        {performanceStats?.RecentTops && topRunsCount > 0 && (
          <div className={s.recentActivitySection}>
            <h2>Recent Activity</h2>
            <p className={s.sectionDescription}>
              Latest top {topRunsCount} finishes and achievements
            </p>

            <div className={s.recentActivityList}>
              {performanceStats.RecentTops.map((run, index) => (
                <Link
                  href={`/map?mapid=${run.Cpid}`}
                  className={s.recentActivityItem}
                  key={index}
                >
                  <div className={s.activityIcon}>
                    <svg aria-hidden="true">
                      <use href="/icons-sprite.svg#star" />
                    </svg>
                  </div>
                  <div className={s.activityContent}>
                    <div className={s.activityTitle}>{run.MapName}</div>
                    <div className={s.activityDetails}>
                      <span className={s.activityRank}>Rank #{run.Rank}</span>
                      <span className={s.activityFps}>{run.FPS} FPS</span>
                      <span className={s.activityDate}>
                        {formatDate(run.FinishDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerOverview;

function formatDate(dateString) {
  if (!dateString) return "N/A";

  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}
