"use client";

import s from "@/components/Pages/PlayerProfile/leaderboardsTab.module.scss";
import { getModifiedRank } from "@/functions/components";
import { useState } from "react";
import { useSelector } from "react-redux";

const LeaderboardsTab = () => {
  const { leaderboardPositionsLoading, leaderboardPositions } = useSelector(
    (s) => s.playerProfile,
  );

  const [selectedLeaderboardFps, setSelectedLeaderboardFps] = useState(125);

  // Process and group leaderboard data by FPS
  function getProcessedLeaderboards() {
    if (!leaderboardPositions || leaderboardPositions.length === 0) return {};

    const filteredPositions = leaderboardPositions.filter(
      (pos) => +pos.FPS === selectedLeaderboardFps,
    );

    const groupedByFps = filteredPositions.reduce((acc, position) => {
      const fps = +position.FPS;
      if (!acc[fps]) acc[fps] = [];
      acc[fps].push(position);
      return acc;
    }, {});

    Object.keys(groupedByFps).forEach((fps) => {
      groupedByFps[fps].sort((a, b) =>
        a.LeaderboardType.localeCompare(b.LeaderboardType),
      );
    });

    return groupedByFps;
  }

  function getRankClass(rankValue) {
    const rank = Number(rankValue);

    if (!Number.isFinite(rank) || rank <= 0) return "";
    if (rank <= 3) return s[`rank${rank}`];

    return "";
  }

  function getLeaderboardType(type) {
    if (type === "jump") return "skilled";
    if (type === "howmany") return "Route Completion";
    return type;
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
                {[43, 76, 125, 250, 333, "mix"].map((fps) => (
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
                          className={s.leaderboardCard}
                        >
                          <div className={s.leaderboardCardHeader}>
                            <div
                              className={`${s.leaderboardRank} ${getRankClass(
                                position.Rank,
                              )}`}
                            >
                              <span className={s.rankNumber}>
                                {position.Rank}
                              </span>
                            </div>

                            <div className={s.leaderboardInfo}>
                              <h3>
                                {getLeaderboardType(position.LeaderboardType)}
                              </h3>
                              <div className={s.leaderboardDetails}>
                                <span className={s.leaderboardFps}>
                                  {position.FPS} FPS
                                </span>
                              </div>
                            </div>

                            {position.Rank <= 3 && (
                              <div className={s.leaderboardIcon}>
                                {getModifiedRank(position.Rank)}
                              </div>
                            )}
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
