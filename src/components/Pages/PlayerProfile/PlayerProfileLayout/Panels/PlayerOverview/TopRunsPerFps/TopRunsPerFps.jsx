"use client";

import { useSelector } from "react-redux";
import s from "./TopRunsPerFps.module.scss";

const TopRunsPerFps = () => {
  const performanceStats = useSelector((s) => s.playerProfile.performanceStats);

  const topsPerFps = performanceStats?.NbTopsPerFps;
  const isFpsDataEmpty = !topsPerFps || Object.keys(topsPerFps).length === 0;

  if (isFpsDataEmpty) return null;

  const totalRuns = Object.values(topsPerFps).reduce((a, b) => a + b, 0);
  const FpsAndRuns = Object.entries(topsPerFps);

  return (
    <div className={s.fpsPerformanceSection}>
      <div className={s.fpsHeader}>
        <h2>Top Runs Per FPS</h2>
        <div className={s.totalRuns}>
          Total Runs: <strong>{totalRuns}</strong>
        </div>
      </div>

      <div className={s.fpsOverviewStats}>
        {FpsAndRuns.map(([fps, numberOfRuns]) => {
          const totalTops = Object.values(topsPerFps).reduce(
            (sum, val) => sum + val,
            0,
          );
          const percentage =
            totalTops > 0 ? Math.round((numberOfRuns / totalTops) * 100) : 0;
          const isBestFps = fps === performanceStats.BestFPS;

          return (
            <div
              key={fps}
              className={`${s.fpsOverviewItem} ${
                isBestFps ? s.bestFpsOverview : ""
              }`}
            >
              <div className={s.fpsOverviewLabel}>
                <span className={s.fpsValue}>
                  {fps === "0" ? "Mixed" : fps}
                </span>
                <span className={s.fpsText}>FPS</span>
              </div>
              <div className={s.fpsOverviewValue}>
                {numberOfRuns.toLocaleString()}
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
  );
};

export default TopRunsPerFps;
