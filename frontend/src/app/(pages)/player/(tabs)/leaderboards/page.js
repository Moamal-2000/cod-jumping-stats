"use client";

import s from "@/Components/Pages/PlayerProfile/leaderboardsTab.module.scss";
import { getRankCategory } from "@/Functions/utils";
import { useState } from "react";
import { useSelector } from "react-redux";

const LeaderboardsTab = () => {
  const { leaderboardPositionsLoading, leaderboardPositions } = useSelector(
    (s) => s.playerProfile
  );

  const [selectedLeaderboardFps, setSelectedLeaderboardFps] = useState("125");
  const [visibleLeaderboards, setVisibleLeaderboards] = useState({
    defrag: false,
    surf: false,
    jump: true,
    speed: true,
  });

  // Process and group leaderboard data by FPS
  function getProcessedLeaderboards() {
    if (!leaderboardPositions || leaderboardPositions.length === 0) return {};

    // Filter out howmany leaderboards (they're displayed separately in the controls)
    // and filter out hidden leaderboards (defrag, surf, jump, speed)
    const otherPositions = leaderboardPositions.filter((pos) => {
      if (pos.leaderboard_type === "howmany") return false;
      if (pos.leaderboard_type === "defrag" && !visibleLeaderboards.defrag)
        return false;
      if (pos.leaderboard_type === "surf" && !visibleLeaderboards.surf)
        return false;
      if (pos.leaderboard_type === "jump" && !visibleLeaderboards.jump)
        return false;
      if (pos.leaderboard_type === "speed" && !visibleLeaderboards.speed)
        return false;
      return true;
    });

    // Filter by selected FPS only
    const filteredPositions = otherPositions.filter(
      (pos) => pos.fps === selectedLeaderboardFps
    );

    // Group positions by FPS (should only be one FPS now)
    const groupedByFps = filteredPositions.reduce((acc, position) => {
      const fps = position.fps;
      if (!acc[fps]) {
        acc[fps] = [];
      }
      acc[fps].push(position);
      return acc;
    }, {});

    // Sort each FPS group by leaderboard name
    Object.keys(groupedByFps).forEach((fps) => {
      groupedByFps[fps].sort((a, b) =>
        a.leaderboard_type.localeCompare(b.leaderboard_type)
      );
    });

    return groupedByFps;
  }

  // Toggle leaderboard visibility
  function toggleLeaderboard(leaderboard) {
    setVisibleLeaderboards((prev) => ({
      ...prev,
      [leaderboard]: !prev[leaderboard],
    }));
  }

  return (
    <div className={s.leaderboardTab}>
      <div className={s.leaderboardHeader}>
        <div className={s.leaderboardHeaderRow}>
          <div className={s.leaderboardControls}>
            <div className={s.fpsToggleGroup}>
              <label>Show FPS:</label>
              <div className={s.fpsToggleButtons}>
                {["125", "250", "mix", "333", "76", "43"].map((fps) => (
                  <button
                    key={fps}
                    className={`${s.fpsToggleButton} ${
                      selectedLeaderboardFps === fps ? s.active : ""
                    }`}
                    onClick={() => setSelectedLeaderboardFps(fps)}
                  >
                    {fps === "mix" ? "Mixed" : fps}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.leaderboardToggleGroup}>
              <label>Show Leaderboards:</label>
              <div className={s.leaderboardToggleButtons}>
                <button
                  className={`${s.leaderboardToggleButton} ${
                    visibleLeaderboards.defrag ? s.active : ""
                  }`}
                  onClick={() => toggleLeaderboard("defrag")}
                >
                  Defrag
                </button>
                <button
                  className={`${s.leaderboardToggleButton} ${
                    visibleLeaderboards.surf ? s.active : ""
                  }`}
                  onClick={() => toggleLeaderboard("surf")}
                >
                  Surf
                </button>
                <button
                  className={`${s.leaderboardToggleButton} ${
                    visibleLeaderboards.jump ? s.active : ""
                  }`}
                  onClick={() => toggleLeaderboard("jump")}
                >
                  Jump
                </button>
                <button
                  className={`${s.leaderboardToggleButton} ${
                    visibleLeaderboards.speed ? s.active : ""
                  }`}
                  onClick={() => toggleLeaderboard("speed")}
                >
                  Speed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {leaderboardPositionsLoading ? (
        <div className={s.loadingContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading leaderboard positions...</p>
        </div>
      ) : (
        <div className={s.leaderboardContent}>
          {(() => {
            const processedGroups = getProcessedLeaderboards();
            const visibleGroups = Object.keys(processedGroups);

            return visibleGroups.length > 0 ? (
              <>
                {visibleGroups.map((fps) => (
                  <div key={fps} className={s.fpsGroup}>
                    <h3 className={s.fpsGroupTitle}>
                      {fps === "mix"
                        ? "Mixed FPS Leaderboards"
                        : `${fps} FPS Leaderboards`}
                    </h3>
                    <div className={s.leaderboardList}>
                      {processedGroups[fps].map((position, index) => (
                        <div
                          key={`${fps}-${index}`}
                          className={`${s.leaderboardCard} ${
                            s[getRankCategory(position.rank)]
                          }`}
                        >
                          <div className={s.leaderboardCardHeader}>
                            <div
                              className={`${s.leaderboardRank} ${
                                s[getRankCategory(position.rank)]
                              }`}
                            >
                              <span className={s.rankNumber}>
                                {position.rank}
                              </span>
                            </div>
                            <div className={s.leaderboardInfo}>
                              <h3>
                                {position.leaderboard_type
                                  .charAt(0)
                                  .toUpperCase() +
                                  position.leaderboard_type.slice(1)}
                              </h3>
                              <div className={s.leaderboardDetails}>
                                <span className={s.leaderboardFps}>
                                  {position.fps} FPS
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={s.leaderboardStats}>
                            <div className={s.leaderboardScore}>
                              <span className={s.statLabel}>Score:</span>
                              <span className={s.statValue}>
                                {position.score.toLocaleString()}
                              </span>
                            </div>
                            <div className={s.leaderboardRating}>
                              <span className={s.statLabel}>Rating:</span>
                              <span className={s.statValue}>
                                {position.rating.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className={s.emptyState}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#trophy" />
                </svg>
                <p>
                  No leaderboard positions found for the selected FPS filters.
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default LeaderboardsTab;
