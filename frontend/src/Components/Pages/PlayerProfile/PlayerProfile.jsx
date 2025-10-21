"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import s from "./PlayerProfile.module.scss";

const PlayerProfile = () => {
  const performanceStats = useSelector((s) => s.playerProfile.performanceStats);
  const topRunsCount = performanceStats?.recent_tops?.length;

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
    if (completionRate >= 95) return "mythical";
    if (completionRate >= 85) return "legendary";
    if (completionRate >= 70) return "epic";
    if (completionRate >= 50) return "rare";
    if (completionRate >= 25) return "uncommon";
    return "common";
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  return (
    <div className={s.tabContent}>
      <div className={s.overviewTab}>
        {/* Player Information */}
        <div className={s.playerStatsOverview}>
          <div className={s.statsHeader}>
            <h2>Player Information</h2>
          </div>

          <div className={s.playerInfoContainer}>
            {performanceStats ? (
              <div className={s.mainInfoCard}>
                <div className={s.infoGrid}>
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Routes Completed</div>
                    <div className={s.infoValue}>
                      {performanceStats.total_maps_completed.toLocaleString()}
                    </div>
                    <div
                      className={s.infoSubtext}
                      style={{
                        color: getCompletionRateInfo(
                          performanceStats.maps_completed_ratio * 100
                        ).color,
                        textShadow: `0 0 8px ${
                          getCompletionRateInfo(
                            performanceStats.maps_completed_ratio * 100
                          ).glow
                        }`,
                      }}
                    >
                      {Math.round(performanceStats.maps_completed_ratio * 100)}%
                      completion rate
                    </div>
                  </div>

                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Last Seen</div>
                    <div className={s.infoValue}>
                      {performanceStats.days_since_last_seen === 0
                        ? "Today"
                        : performanceStats.days_since_last_seen === 1
                        ? "Yesterday"
                        : `${performanceStats.days_since_last_seen} days ago`}
                    </div>
                    {performanceStats.last_seen && (
                      <div className={s.infoSubtext}>
                        {formatLastSeen(performanceStats.last_seen)}
                      </div>
                    )}
                  </div>

                  {performanceStats?.oldest_top10_map && (
                    <div className={s.infoItem}>
                      <div className={s.infoLabel}>Oldest standing record</div>
                      <div className={s.infoValue}>
                        {performanceStats.oldest_top10_map.map_name}
                      </div>
                      <div className={s.infoSubtext}>
                        Rank #{performanceStats.oldest_top10_map.rank} •{" "}
                        {performanceStats.oldest_top10_map.fps} FPS •{" "}
                        {formatDate(
                          performanceStats.oldest_top10_map.finish_date
                        )}
                      </div>
                    </div>
                  )}

                  {performanceStats?.oldest_top && (
                    <div className={s.infoItem}>
                      <div className={s.infoLabel}>Oldest top run</div>
                      <div className={s.infoValue}>
                        {performanceStats.oldest_top.map_name}
                      </div>
                      <div className={s.infoSubtext}>
                        Rank #{performanceStats.oldest_top.rank} •{" "}
                        {performanceStats.oldest_top.fps} FPS •{" "}
                        {formatDate(performanceStats.oldest_top.finish_date)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={s.mainInfoCard}>
                <div className={s.infoGrid}>
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Player Data</div>
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

        {/* FPS Performance Overview */}
        {performanceStats?.nb_tops_per_fps &&
          Object.keys(performanceStats.nb_tops_per_fps).length > 0 && (
            <div className={s.fpsPerformanceSection}>
              <h2>FPS Performance</h2>
              <p className={s.sectionDescription}>
                Number of runs in top 10 per fps
              </p>

              <div className={s.fpsOverviewContainer}>
                <div className={s.fpsOverviewStats}>
                  {Object.entries(performanceStats.nb_tops_per_fps)
                    .sort(([a], [b]) => {
                      const order = ["125", "250", "333", "76", "43", "mix"];
                      return order.indexOf(a) - order.indexOf(b);
                    })
                    .map(([fps, count]) => {
                      const totalTops = Object.values(
                        performanceStats.nb_tops_per_fps
                      ).reduce((sum, val) => sum + val, 0);
                      const percentage =
                        totalTops > 0
                          ? Math.round((count / totalTops) * 100)
                          : 0;
                      const isBestFps = fps === performanceStats.best_fps;

                      return (
                        <div
                          key={fps}
                          className={`${s.fpsOverviewItem} ${
                            isBestFps ? s.bestFpsOverview : ""
                          }`}
                        >
                          <div className={s.fpsOverviewLabel}>
                            {fps} FPS
                            {isBestFps && (
                              <span className={s.bestFpsIndicator}>
                                <svg>
                                  <use href="/icons-sprite.svg#star" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className={s.fpsOverviewValue}>
                            {count.toLocaleString()}
                          </div>
                          <div className={s.fpsOverviewPercentage}>
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className={s.fpsSummary}>
                  <div className={s.fpsSummaryItem}>
                    <span className={s.fpsSummaryLabel}>Total Top Runs</span>
                    <span className={s.fpsSummaryValue}>
                      {Object.values(performanceStats.nb_tops_per_fps)
                        .reduce((sum, val) => sum + val, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className={s.fpsSummaryItem}>
                    <span className={s.fpsSummaryLabel}>Best FPS</span>
                    <span className={s.fpsSummaryValue}>
                      {performanceStats.best_fps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Recent Activity */}
        {performanceStats?.recent_tops && topRunsCount > 0 && (
          <div className={s.recentActivitySection}>
            <h2>Recent Activity</h2>
            <p className={s.sectionDescription}>
              Latest top {topRunsCount} finishes and achievements
            </p>

            <div className={s.recentActivityList}>
              {performanceStats.recent_tops.map((run, index) => (
                <Link
                  href={`/map?mapid=${run.cpid}`}
                  className={s.recentActivityItem}
                  key={index}
                >
                  <div className={s.activityIcon}>
                    <svg>
                      <use href="/icons-sprite.svg#star" />
                    </svg>
                  </div>
                  <div className={s.activityContent}>
                    <div className={s.activityTitle}>{run.map_name}</div>
                    <div className={s.activityDetails}>
                      <span className={s.activityRank}>Rank #{run.rank}</span>
                      <span className={s.activityFps}>{run.fps} FPS</span>
                      <span className={s.activityDate}>
                        {formatDate(run.finish_date)}
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

export default PlayerProfile;
