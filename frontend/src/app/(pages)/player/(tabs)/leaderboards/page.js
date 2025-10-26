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

    const otherPositions = leaderboardPositions.filter((pos) => {
      if (pos.LeaderboardType === "howmany") return false;
      if (pos.LeaderboardType === "defrag" && !visibleLeaderboards.defrag)
        return false;
      if (pos.LeaderboardType === "surf" && !visibleLeaderboards.surf)
        return false;
      if (pos.LeaderboardType === "jump" && !visibleLeaderboards.jump)
        return false;
      if (pos.LeaderboardType === "speed" && !visibleLeaderboards.speed)
        return false;
      return true;
    });

    const filteredPositions = otherPositions.filter(
      (pos) => pos.FPS === selectedLeaderboardFps
    );

    const groupedByFps = filteredPositions.reduce((acc, position) => {
      const fps = position.FPS;
      if (!acc[fps]) acc[fps] = [];
      acc[fps].push(position);
      return acc;
    }, {});

    Object.keys(groupedByFps).forEach((fps) => {
      groupedByFps[fps].sort((a, b) =>
        a.LeaderboardType.localeCompare(b.LeaderboardType)
      );
    });

    return groupedByFps;
  }

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
              <div
                className={s.fpsToggleButtons}
                role="tablist"
                aria-label="FPS selector"
              >
                {["125", "250", "mix", "333", "76", "43"].map((fps) => (
                  <button
                    key={fps}
                    type="button"
                    role="tab"
                    aria-selected={selectedLeaderboardFps === fps}
                    aria-pressed={selectedLeaderboardFps === fps}
                    aria-label={`Show ${
                      fps === "mix" ? "Mixed" : fps
                    } FPS leaderboards`}
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
              <div
                className={s.leaderboardToggleButtons}
                role="toolbar"
                aria-label="Leaderboard toggles"
              >
                {[
                  { key: "defrag", label: "Defrag" },
                  { key: "surf", label: "Surf" },
                  { key: "jump", label: "Jump" },
                  { key: "speed", label: "Speed" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={!!visibleLeaderboards[key]}
                    aria-label={`Toggle ${label} leaderboards`}
                    className={`${s.leaderboardToggleButton} ${
                      visibleLeaderboards[key] ? s.active : ""
                    }`}
                    onClick={() => toggleLeaderboard(key)}
                  >
                    {label}
                  </button>
                ))}
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

                    <div className={s.leaderboardList} role="list">
                      {processedGroups[fps].map((position, index) => (
                        <div
                          key={`${fps}-${index}`}
                          role="listitem"
                          tabIndex={0}
                          aria-label={`Leaderboard ${
                            position.LeaderboardType
                          } — Rank ${
                            position.Rank
                          }, Score ${position.Score.toLocaleString()}, ${
                            position.FPS
                          } FPS`}
                          className={`${s.leaderboardCard} ${
                            s[getRankCategory(position.Rank)]
                          }`}
                        >
                          <div className={s.leaderboardCardHeader}>
                            <div
                              className={`${s.leaderboardRank} ${
                                s[getRankCategory(position.Rank)]
                              }`}
                            >
                              <span className={s.rankNumber}>
                                {position.Rank}
                              </span>
                            </div>

                            <div className={s.leaderboardInfo}>
                              <h3>
                                {position.LeaderboardType.charAt(
                                  0
                                ).toUpperCase() +
                                  position.LeaderboardType.slice(1)}
                              </h3>
                              <div className={s.leaderboardDetails}>
                                <span className={s.leaderboardFps}>
                                  {position.FPS} FPS
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={s.leaderboardStats}>
                            <div className={s.leaderboardScore}>
                              <span className={s.statLabel}>Score:</span>
                              <span className={s.statValue}>
                                {position.Score.toLocaleString()}
                              </span>
                            </div>
                            <div className={s.leaderboardRating}>
                              <span className={s.statLabel}>Rating:</span>
                              <span className={s.statValue}>
                                {position.Rating.toFixed(2)}
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
