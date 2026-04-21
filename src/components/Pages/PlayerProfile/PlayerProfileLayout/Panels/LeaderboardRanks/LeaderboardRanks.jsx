"use client";
import { getModifiedRank } from "@/components/Helper/rankBadge";
import { useState } from "react";
import { useSelector } from "react-redux";
import s from "./LeaderboardRanks.module.scss";

const LeaderboardRanks = () => {
  const { leaderboardPositionsLoading, leaderboardPositions } = useSelector(
    (s) => s.playerProfile,
  );

  const [selectedFps, setSelectedFps] = useState(125);

  const leaderboards = getProcessedLeaderboards();

  function getProcessedLeaderboards() {
    if (!leaderboardPositions || leaderboardPositions.length === 0) {
      return {};
    }

    const filteredPositions = leaderboardPositions.filter(
      (position) => +position.FPS === selectedFps,
    );

    return filteredPositions;
  }

  function getRankClass(rankValue) {
    const rank = Number(rankValue);

    if (!Number.isFinite(rank) || rank <= 0) {
      return "";
    }
    if (rank <= 3) {
      return s[`rank${rank}`];
    }

    return "";
  }

  function getLeaderboardType(type) {
    if (type === "jump") {
      return "raw skill";
    }
    if (type === "howmany") {
      return "Route Completion";
    }
    return type;
  }

  return (
    <div className={s.leaderboardTab}>
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
            aria-selected={selectedFps === fps}
            aria-pressed={selectedFps === fps}
            aria-label={`Show ${
              fps === "mix" ? "Mixed" : fps
            } FPS leaderboards`}
            className={`${s.fpsToggleButton} ${
              selectedFps === fps ? s.active : ""
            }`}
            onClick={() => setSelectedFps(fps)}
          >
            {fps === "mix" ? "Mixed" : fps}
          </button>
        ))}
      </div>

      {leaderboardPositionsLoading ? (
        <div className={s.loadingContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading leaderboard positions...</p>
        </div>
      ) : (
        <div className={s.leaderboardContent}>
          <h3 className={s.fpsGroupTitle}>
            {selectedFps === "mix"
              ? "Mixed FPS Leaderboards"
              : `${selectedFps} FPS Leaderboards`}
          </h3>

          {leaderboards.length > 0 && (
            <div className={s.leaderboardList}>
              {leaderboards.map((leaderboard, index) => (
                <div
                  key={leaderboard.Rating + index}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Leaderboard ${
                    leaderboard.LeaderboardType
                  } — Rank ${
                    leaderboard.Rank
                  }, Score ${leaderboard.Score.toLocaleString()}, ${
                    leaderboard.FPS
                  } FPS`}
                  className={`${s.leaderboardCard} ${getRankClass(
                    leaderboard.Rank,
                  )}`}
                >
                  <div className={s.leaderboardCardHeader}>
                    <div
                      className={`${s.leaderboardRank} ${getRankClass(
                        leaderboard.Rank,
                      )}`}
                    >
                      <span className={s.rankNumber}>{leaderboard.Rank}</span>
                    </div>

                    <div className={s.leaderboardInfo}>
                      <h3>{getLeaderboardType(leaderboard.LeaderboardType)}</h3>
                      <div className={s.leaderboardDetails}>
                        <span className={s.leaderboardFps}>
                          {leaderboard.FPS} FPS
                        </span>
                      </div>
                    </div>

                    {leaderboard.Rank <= 3 && (
                      <div className={s.leaderboardIcon}>
                        {getModifiedRank(leaderboard.Rank)}
                      </div>
                    )}
                  </div>

                  <div className={s.leaderboardStats}>
                    <div className={s.leaderboardScore}>
                      <span className={s.statLabel}>Score:</span>
                      <span className={s.statValue}>
                        {leaderboard.Score.toLocaleString()}
                      </span>
                    </div>
                    <div className={s.leaderboardRating}>
                      <span className={s.statLabel}>Rating:</span>
                      <span className={s.statValue}>
                        {leaderboard.Rating.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {leaderboards.length === 0 && (
            <div className={s.emptyState}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#trophy" />
              </svg>
              <p>No leaderboard positions found for the selected FPS.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardRanks;
