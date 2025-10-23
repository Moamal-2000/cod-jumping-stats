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
    if (completionRate >= 95) return {
      class: "highlight",
      gradient: "linear-gradient(90deg, #f59e0b, #f97316)"
    };
    if (completionRate >= 85) return {
      class: "highlight",
      gradient: "linear-gradient(90deg, #8b5cf6, #a855f7)"
    };
    if (completionRate >= 70) return {
      class: "highlight",
      gradient: "linear-gradient(90deg, #3b82f6, #6366f1)"
    };
    if (completionRate >= 50) return {
      class: "highlight",
      gradient: "linear-gradient(90deg, #10b981, #14b8a6)"
    };
    if (completionRate >= 25) return {
      class: "highlight",
      gradient: "linear-gradient(90deg, #06b6d4, #0ea5e9)"
    };
    return { class: "" };
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
                <div className={s.infoGrid}>
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3h18v18H3z"></path>
                        <path d="M7 7h10v10H7z"></path>
                        <path d="M7 12h10"></path>
                      </svg>
                      Routes Completed
                    </div>
                    <div className={`${s.infoValue} ${getCompletionRateInfo(performanceStats.maps_completed_ratio * 100).class}`}>
                      {performanceStats.total_maps_completed.toLocaleString()}
                    </div>
                    <div className={`${s.infoSubtext} ${s.highlight}`}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {Math.round(performanceStats.maps_completed_ratio * 100)}% completion rate
                    </div>
                    <div className={s.progressBar}>
                      <div 
                        className={s.progressBarFill} 
                        style={{ 
                          width: `${performanceStats.maps_completed_ratio * 100}%`,
                          background: getCompletionRateInfo(performanceStats.maps_completed_ratio * 100).gradient || 'var(--accent-color)'
                        }}
                      />
                    </div>
                  </div>

                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Last Active
                    </div>
                    <div className={s.infoValue}>
                      {performanceStats.days_since_last_seen === 0
                        ? "Today"
                        : performanceStats.days_since_last_seen === 1
                        ? "Yesterday"
                        : `${performanceStats.days_since_last_seen} days ago`}
                    </div>
                    {performanceStats.last_seen && (
                      <div className={s.infoSubtext}>
                        Last seen: {formatLastSeen(performanceStats.last_seen)}
                      </div>
                    )}
                  </div>

                  {performanceStats?.oldest_top10_map && (
                    <div className={s.infoItem}>
                      <div className={s.infoLabel}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        Oldest Standing Record
                      </div>
                      <div className={s.mapName} title={performanceStats.oldest_top10_map.map_name}>
                        {performanceStats.oldest_top10_map.map_name}
                      </div>
                      <div className={s.metaInfo}>
                        <span>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          Rank #{performanceStats.oldest_top10_map.rank}
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {performanceStats.oldest_top10_map.fps} FPS
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formatDate(performanceStats.oldest_top10_map.finish_date)}
                        </span>
                      </div>
                    </div>
                  )}

                  {performanceStats?.oldest_top && (
                    <div className={s.infoItem}>
                      <div className={s.infoLabel}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Oldest Top Run
                      </div>
                      <div className={s.mapName} title={performanceStats.oldest_top.map_name}>
                        {performanceStats.oldest_top.map_name}
                      </div>
                      <div className={s.metaInfo}>
                        <span>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          Rank #{performanceStats.oldest_top.rank}
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {performanceStats.oldest_top.fps} FPS
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formatDate(performanceStats.oldest_top.finish_date)}
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
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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

        {/* FPS Performance Overview */}
        {performanceStats?.nb_tops_per_fps &&
          Object.keys(performanceStats.nb_tops_per_fps).length > 0 && (
            <div className={s.fpsPerformanceSection}>
              <div className={s.fpsOverviewContainer}>
                <div className={s.fpsHeader}>
                  <h2>Top Runs Per FPS</h2>
                  <div className={s.totalRuns}>
                    Total Runs: <strong>{Object.values(performanceStats.nb_tops_per_fps).reduce((a, b) => a + b, 0).toLocaleString()}</strong>
                  </div>
                </div>

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
                      const rank = Object.entries(performanceStats.nb_tops_per_fps)
                        .sort(([,a], [,b]) => b - a)
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
                                <path fill="currentColor" d="M12 2L4 12l8 10 8-10z" />
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
