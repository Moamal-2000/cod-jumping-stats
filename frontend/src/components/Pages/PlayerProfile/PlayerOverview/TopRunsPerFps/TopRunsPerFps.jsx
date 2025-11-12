"use client";

import { useSelector } from "react-redux";
import s from "./TopRunsPerFps.module.scss";

const TopRunsPerFps = () => {
  const performanceStats = useSelector((s) => s.playerProfile.performanceStats);
  const nbTopsPerFps = performanceStats?.NbTopsPerFps;

  const isFpsDataEmpty =
    !nbTopsPerFps || Object.keys(nbTopsPerFps).length === 0;

  if (isFpsDataEmpty) return null;

  return (
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
                totalTops > 0 ? Math.round((count / totalTops) * 100) : 0;
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
  );
};

export default TopRunsPerFps;
