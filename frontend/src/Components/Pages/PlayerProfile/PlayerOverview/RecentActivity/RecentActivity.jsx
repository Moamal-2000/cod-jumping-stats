"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import s from "./RecentActivity.module.scss";

const RecentActivity = () => {
  const performanceStats = useSelector((s) => s.playerProfile.performanceStats);
  const recentTops = performanceStats?.RecentTops || [];
  const topRunsCount = recentTops?.length;

  if (!recentTops && topRunsCount <= 0) return null;

  return (
    <div className={s.recentActivitySection}>
      <h2>Recent Activity</h2>
      <p className={s.sectionDescription}>
        Latest top {topRunsCount} finishes and achievements
      </p>

      <div className={s.recentActivityList}>
        {recentTops.map((run, index) => (
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
  );
};

export default RecentActivity;

function formatDate(dateString) {
  if (!dateString) return "N/A";

  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}
