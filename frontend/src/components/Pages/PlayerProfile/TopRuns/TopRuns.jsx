"use client";

import { formatDate, getRankCategory } from "@/functions/utils";
import { updatePlayerProfileState } from "@/redux/features/playerProfile/slice/playerProfileSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./TopRuns.module.scss";

const jumpScoresByFps = {
  125: null,
  250: null,
  mix: null,
  333: null,
  76: null,
  43: null,
};

const TopRuns = () => {
  const { topRuns, topRunsLoading, jumpScoresLoading, currentFetchingFps } =
    useSelector((s) => s.playerProfile);
  const dispatch = useDispatch();

  const [rankFilter, setRankFilter] = useState("1-10"); // "1", "1-10", "all"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [sortBy, setSortBy] = useState("score"); // "rank", "time", "date", "score"

  const [visibleTopRunsFps, setVisibleTopRunsFps] = useState({
    125: true,
    250: false,
    mix: false,
    333: false,
    76: false,
    43: false,
  });

  const [topRunsByFps, setTopRunsByFps] = useState({
    125: {},
    250: {},
    mix: {},
    333: {},
    76: {},
    43: {},
  });

  // Process and filter top runs data, combining jump-scores and tops data
  function getProcessedTopRuns() {
    // Combine data from all visible FPS values
    let allRuns = [];

    Object.keys(visibleTopRunsFps).forEach((fps) => {
      if (
        visibleTopRunsFps[fps] &&
        topRunsByFps[fps] &&
        Object.keys(topRunsByFps[fps]).length > 0
      ) {
        // Process data for this FPS
        Object.keys(topRunsByFps[fps]).forEach((rank) => {
          if (
            topRunsByFps[fps][rank] &&
            Array.isArray(topRunsByFps[fps][rank])
          ) {
            allRuns = allRuns.concat(
              topRunsByFps[fps][rank].map((run) => ({
                ...run,
                rank: parseInt(rank),
                fps: fps, // Add FPS to each run
              }))
            );
          }
        });
      }
    });

    if (allRuns.length === 0) return [];

    // Enhance runs with FPS-specific jump-scores data
    allRuns = allRuns.map((run) => {
      let jumpScore = 0;
      let difficulty = null;

      // Get the jump scores for this run's FPS
      const fpsJumpScores = jumpScoresByFps[run.fps];
      if (fpsJumpScores?.map_scores) {
        // Find matching map score from the FPS-specific jump-scores API
        const mapScore = fpsJumpScores.map_scores.find(
          (ms) => ms.map_id === run.cpid || ms.map_name === run.mapname
        );

        if (mapScore) {
          jumpScore = mapScore.score || 0;
          difficulty = mapScore.difficulty;
        }
      }

      return {
        ...run,
        // Use FPS-specific jump-scores for scoring information, default to 0 if not found
        jumpScore: jumpScore,
        difficulty: difficulty,
        // Keep tops API data for rank and other details
        originalRank: run.rank,
        originalTotalNr: run.totalNr,
      };
    });

    let filteredRuns = allRuns;

    // Filter by rank
    if (rankFilter === "1") {
      filteredRuns = filteredRuns.filter((run) => run.rank === 1);
    } else if (rankFilter === "1-10") {
      filteredRuns = filteredRuns.filter(
        (run) => run.rank >= 1 && run.rank <= 10
      );
    }
    // "all" shows everything, no additional filtering needed

    // Sort the data
    filteredRuns.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "rank":
          comparison = a.rank - b.rank;
          break;
        case "time":
          comparison = a.time_played - b.time_played;
          break;
        case "date":
          comparison = new Date(a.time_created) - new Date(b.time_created);
          break;
        case "score":
          // Always use jump-scores (defaults to 0 if not found)
          const scoreA = a.jumpScore || 0;
          const scoreB = b.jumpScore || 0;
          comparison = scoreA - scoreB;
          break;
        default:
          comparison = a.rank - b.rank;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filteredRuns;
  }

  // Toggle top runs FPS visibility
  function toggleTopRunsFps(fps) {
    const newVisibleState = !visibleTopRunsFps[fps];

    setVisibleTopRunsFps((prev) => ({
      ...prev,
      [fps]: newVisibleState,
    }));

    // If enabling this FPS and we don't have data for it, fetch it
    if (
      newVisibleState &&
      (!topRunsByFps[fps] || Object.keys(topRunsByFps[fps]).length === 0)
    ) {
      dispatch(
        updatePlayerProfileState({ key: "currentFetchingFps", value: fps })
      );
    }
  }

  // Calculate score and get epic styling
  function getScoreInfo(run) {
    // Always use jump-scores (defaults to 0 if not found)
    const score = run.jumpScore || 0;
    const totalNr = run.originalTotalNr || run.totalNr;
    const percentage = totalNr > 0 ? (score / totalNr) * 100 : 0;

    return {
      score,
      percentage,
      isEpic: score >= 400, // Epic threshold - starts giving credit from 400
      isLegendary: score >= 800, // Legendary threshold
      isMythical: score >= 1200, // Mythical threshold (max)
    };
  }

  function formatTime(timeString) {
    if (!timeString) return "N/A";
    return timeString;
  }

  // Handle fetched top runs data and store by FPS
  useEffect(() => {
    if (topRuns && Object.keys(topRuns).length > 0 && currentFetchingFps) {
      setTopRunsByFps((prev) => ({
        ...prev,
        [currentFetchingFps]: topRuns,
      }));
    }
  }, [topRuns, currentFetchingFps]);

  return (
    <div className={s.topRunsTab}>
      <div className={s.topRunsHeader}>
        <div className={s.topRunsControls}>
          <div className={s.fpsToggleGroup}>
            <label>Show FPS:</label>
            <div className={s.fpsToggleButtons}>
              {["125", "250", "mix", "333", "76", "43"].map((fps) => (
                <button
                  key={fps}
                  className={`${s.fpsToggleButton} ${
                    visibleTopRunsFps[fps] ? s.active : ""
                  }`}
                  onClick={() => toggleTopRunsFps(fps)}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>

          <div className={s.controlGroup}>
            <label htmlFor="rank-filter">Rank Filter:</label>
            <select
              id="rank-filter"
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className={s.rankSelect}
            >
              <option value="1">Top 1 Only</option>
              <option value="1-10">Top 1-10</option>
              <option value="all">All Ranks</option>
            </select>
          </div>

          <div className={s.controlGroup}>
            <label htmlFor="sort-by">Sort By:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={s.sortSelect}
            >
              <option value="rank">Rank</option>
              <option value="time">Time</option>
              <option value="date">Date</option>
              <option value="score">Score</option>
            </select>
          </div>

          <div className={s.controlGroup}>
            <label htmlFor="sort-order">Order:</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={s.orderSelect}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {topRunsLoading || jumpScoresLoading ? (
        <div className={s.loadingContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading top runs...</p>
        </div>
      ) : (
        <div className={s.topRunsContent}>
          {/* Detailed Top Runs */}
          {(() => {
            const processedRuns = getProcessedTopRuns();
            return processedRuns.length > 0 ? (
              <>
                <div className={s.runsSummary}>
                  <p>
                    Showing {processedRuns.length} detailed run
                    {processedRuns.length !== 1 ? "s" : ""}
                    {rankFilter === "1"
                      ? " (Top 1 only)"
                      : rankFilter === "1-10"
                      ? " (Top 1-10)"
                      : " (All ranks)"}
                  </p>
                </div>
                <div className={s.topRunsList}>
                  <table className={s.leaderboardTable}>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Map Name</th>
                        <th>FPS</th>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedRuns.map((run, index) => {
                        const scoreInfo = getScoreInfo(run);
                        const rowClass = scoreInfo.isMythical
                          ? s.mythical
                          : scoreInfo.isLegendary
                          ? s.legendary
                          : scoreInfo.isEpic
                          ? s.epic
                          : "";
                        const rankCategory = getRankCategory(run.rank);
                        return (
                          <tr
                            key={`${run.run_id}-${index}`}
                            className={rowClass}
                          >
                            <td className={s.rankCell}>
                              <div
                                className={`${s.rankBadge} ${s[rankCategory]}`}
                              >
                                <span>{run.rank}</span>
                                <span>/</span>
                                <span>{run.totalNr}</span>
                              </div>
                            </td>
                            <td className={s.mapNameCell} title={run.mapname}>
                              {run.mapname}
                            </td>
                            <td>
                              <span className={s.fpsCell}>{run.fps}</span>
                            </td>
                            <td>
                              <span
                                className={`${s.scoreCell} ${
                                  scoreInfo.isMythical
                                    ? s.mythical
                                    : scoreInfo.isLegendary
                                    ? s.legendary
                                    : scoreInfo.isEpic
                                    ? s.epic
                                    : ""
                                }`}
                              >
                                {scoreInfo.score.toLocaleString()}
                              </span>
                            </td>
                            <td className={s.timeCell}>
                              {formatTime(run.time_played_string)}
                            </td>
                            <td className={s.dateCell}>
                              {formatDate(run.time_created, "Unknown")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={s.emptyState}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#star" />
                </svg>
                <p>No runs found for the selected filters.</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TopRuns;
