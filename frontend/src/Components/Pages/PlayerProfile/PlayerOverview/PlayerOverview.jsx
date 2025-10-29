"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import PlayerInfo from "./PlayerInfo/PlayerInfo";
import s from "./PlayerOverview.module.scss";

const PlayerOverview = () => {
  const performanceStats = useSelector((s) => s.playerProfile.performanceStats);
  const topRunsCount = performanceStats?.RecentTops?.length;

  return (
    <div className={s.tabContent}>
      <div className={s.overviewTab}>
        <PlayerInfo />

        {/* FPS Performance Overview */}
        {performanceStats?.NbTopsPerFps &&
          Object.keys(performanceStats.NbTopsPerFps).length > 0 && (
            <div className={s.fpsPerformanceSection}>
              <div className={s.fpsOverviewContainer}>
                <div className={s.fpsHeader}>
                  <h2>Top Runs Per FPS</h2>
                  <div className={s.totalRuns}>
                    Total Runs:{" "}
                    <strong>
                      {Object.values(performanceStats.NbTopsPerFps)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className={s.fpsOverviewStats}>
                  {Object.entries(performanceStats.NbTopsPerFps)
                    .sort(([a], [b]) => {
                      const order = ["125", "250", "333", "76", "43", "mix"];
                      return order.indexOf(a) - order.indexOf(b);
                    })
                    .map(([fps, count]) => {
                      const totalTops = Object.values(
                        performanceStats.NbTopsPerFps
                      ).reduce((sum, val) => sum + val, 0);
                      const percentage =
                        totalTops > 0
                          ? Math.round((count / totalTops) * 100)
                          : 0;
                      const isBestFps = fps === performanceStats.BestFPS;
                      const rank =
                        Object.entries(performanceStats.NbTopsPerFps)
                          .sort(([, a], [, b]) => b - a)
                          .findIndex(([f]) => f === fps) + 1;

                      return (
                        <div
                          key={fps}
                          className={`${s.fpsOverviewItem} ${
                            isBestFps ? s.bestFpsOverview : ""
                          }`}
                        >
                          <div className={s.fpsOverviewLabel}>
                            <span className={s.fpsValue}>{fps}</span>
                            <span className={s.fpsText}>FPS</span>
                          </div>
                          <div className={s.fpsOverviewValue}>
                            {count.toLocaleString()}
                          </div>
                          <div className={s.fpsMeta}>
                            <div className={s.fpsPercentage}>
                              <svg viewBox="0 0 24 24" width="16" height="16">
                                <path
                                  fill="currentColor"
                                  d="M12 2L4 12l8 10 8-10z"
                                />
                              </svg>
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

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
