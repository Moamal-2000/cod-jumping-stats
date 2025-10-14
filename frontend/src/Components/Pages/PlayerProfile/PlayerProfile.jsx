"use client";

import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/Functions/components";
import {
  clearPlayerProfile,
  setPlayerInfo,
} from "@/Redux/slices/playerProfileSlice";
import {
  fetchPlayerJumpScores,
  fetchPlayerLeaderboardPositions,
  fetchPlayerProfile,
  fetchPlayerTops,
} from "@/Redux/thunks/playerProfileThunk";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerBadges from "../PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import s from "./PlayerProfile.module.scss";
import PlayerRouteCompletion from "./PlayerRouteCompletion/PlayerRouteCompletion";

const PlayerProfile = ({ playerId: propPlayerId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = propPlayerId || searchParams.get("id");

  const {
    playerInfo,
    performanceStats,
    leaderboardPositions,
    topRuns,
    jumpScores,
    loading,
    error,
    leaderboardPositionsLoading,
    topRunsLoading,
    jumpScoresLoading,
  } = useSelector((state) => state.playerProfile);

  const topRunsCount = performanceStats?.recent_tops?.length;

  // Also get players data to find player name
  const { playersData } = useSelector((state) => state.players);

  // Get player name from available data sources
  const getPlayerName = () => {
    // First try leaderboard positions
    if (leaderboardPositions.length > 0) {
      return leaderboardPositions[0].player_name;
    }

    // Then try top runs
    if (topRuns[1] && topRuns[1].length > 0) {
      return topRuns[1][0].playername;
    }

    // Then try to find in players list
    if (playersData.length > 0 && playerId) {
      const player = playersData.find((p) => p.id === parseInt(playerId));
      if (player) {
        return player.name;
      }
    }

    // Then try performance stats (though it might not have player_name)
    if (performanceStats?.player_name) {
      return performanceStats.player_name;
    }

    // Finally try playerInfo
    if (playerInfo?.name && playerInfo.name !== "Loading...") {
      return playerInfo.name;
    }

    return "Unknown Player";
  };

  const [activeTab, setActiveTab] = useState("overview");

  // Get tab parameter from URL
  const tabParam = searchParams.get("tab");

  // Set active tab based on URL parameter
  useEffect(() => {
    if (
      tabParam &&
      ["overview", "tops", "leaderboards", "routes"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [rankFilter, setRankFilter] = useState("1-10"); // "1", "1-10", "all"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [sortBy, setSortBy] = useState("score"); // "rank", "time", "date", "score"
  const [selectedLeaderboardFps, setSelectedLeaderboardFps] = useState("125");

  const [visibleLeaderboards, setVisibleLeaderboards] = useState({
    defrag: false,
    surf: false,
    jump: true,
    speed: true,
  });

  const [visibleTopRunsFps, setVisibleTopRunsFps] = useState({
    125: true,
    250: false,
    mix: false,
    333: false,
    76: false,
    43: false,
  });

  // Store top runs data for each FPS separately
  const [topRunsByFps, setTopRunsByFps] = useState({
    125: {},
    250: {},
    mix: {},
    333: {},
    76: {},
    43: {},
  });

  // Store jump scores for each FPS separately
  const [jumpScoresByFps, setJumpScoresByFps] = useState({
    125: null,
    250: null,
    mix: null,
    333: null,
    76: null,
    43: null,
  });

  // Track which FPS is currently being fetched
  const [currentFetchingFps, setCurrentFetchingFps] = useState("125");

  useEffect(() => {
    if (playerId) {
      // Clear previous data
      dispatch(clearPlayerProfile());

      // For now, we'll create a basic player info object
      // In a real app, you might want to fetch this from the players list or a separate endpoint
      const basicPlayerInfo = {
        id: playerId,
        name: "Loading...", // This will be updated when we get the actual data
      };

      dispatch(setPlayerInfo(basicPlayerInfo));
      dispatch(fetchPlayerProfile({ playerId, playerInfo: basicPlayerInfo }));
      dispatch(fetchPlayerLeaderboardPositions({ playerId }));
      setCurrentFetchingFps("125");
      dispatch(fetchPlayerTops({ playerId, fps: "125" })); // Start with 125 FPS
      dispatch(fetchPlayerJumpScores({ playerId, fps: "125" }));
    }
  }, [dispatch, playerId]);

  // Handle fetched top runs data and store by FPS
  useEffect(() => {
    if (topRuns && Object.keys(topRuns).length > 0 && currentFetchingFps) {
      setTopRunsByFps((prev) => ({
        ...prev,
        [currentFetchingFps]: topRuns,
      }));
    }
  }, [topRuns, currentFetchingFps]);

  // Handle fetched jump scores and store by FPS
  useEffect(() => {
    if (jumpScores && currentFetchingFps) {
      setJumpScoresByFps((prev) => ({
        ...prev,
        [currentFetchingFps]: jumpScores,
      }));
    }
  }, [jumpScores, currentFetchingFps]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const formatLastSeen = (lastSeen) => {
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
  };

  const getCompletionRateRarity = (completionRate) => {
    if (completionRate >= 95) return "mythical";
    if (completionRate >= 85) return "legendary";
    if (completionRate >= 70) return "epic";
    if (completionRate >= 50) return "rare";
    if (completionRate >= 25) return "uncommon";
    return "common";
  };

  const getCompletionRateInfo = (completionRate) => {
    const rarity = getCompletionRateRarity(completionRate);
    const rarityMap = {
      mythical: { color: "#ff0080", glow: "#ff0080" },
      legendary: { color: "#ff6b35", glow: "#ff6b35" },
      epic: { color: "#9d4edd", glow: "#9d4edd" },
      rare: { color: "#3a86ff", glow: "#3a86ff" },
      uncommon: { color: "#06ffa5", glow: "#06ffa5" },
      common: { color: "#9ca3af", glow: "#9ca3af" },
    };
    return rarityMap[rarity];
  };

  // Get rank category for styling
  const getRankCategory = (rank) => {
    if (rank === 1) return "rank1";
    if (rank === 2) return "rank2";
    if (rank === 3) return "rank3";
    if (rank >= 4 && rank <= 10) return "rank4to10";
    if (rank >= 11 && rank <= 20) return "rank10to20";
    return "rankBelow20";
  };

  // Calculate score and get epic styling
  const getScoreInfo = (run) => {
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
  };

  // Process and group leaderboard data by FPS
  const getProcessedLeaderboards = () => {
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
  };

  // Select single FPS for leaderboard ranks
  const selectLeaderboardFps = (fps) => {
    setSelectedLeaderboardFps(fps);
  };

  // Toggle leaderboard visibility
  const toggleLeaderboard = (leaderboard) => {
    setVisibleLeaderboards((prev) => ({
      ...prev,
      [leaderboard]: !prev[leaderboard],
    }));
  };

  // Toggle top runs FPS visibility
  const toggleTopRunsFps = (fps) => {
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
      setCurrentFetchingFps(fps);
      dispatch(fetchPlayerTops({ playerId, fps }));
      dispatch(fetchPlayerJumpScores({ playerId, fps }));
    }
  };

  // Process and filter top runs data, combining jump-scores and tops data
  const getProcessedTopRuns = () => {
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
  };

  if (loading) {
    return (
      <div className={s.loadingContainer}>
        <div className={s.loadingSpinner}></div>
        <p>Loading player profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.errorContainer}>
        <h2>Error Loading Profile</h2>
        <p>Unable to fetch player data. Please try again later.</p>
        <button onClick={() => router.back()} className={s.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  if (!playerInfo) {
    return (
      <div className={s.errorContainer}>
        <h2>Player Not Found</h2>
        <p>This player profile could not be found.</p>
        <button onClick={() => router.back()} className={s.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "chart-bar" },
    { id: "tops", label: "Top Runs", icon: "star" },
    { id: "leaderboards", label: "Leaderboard Ranks", icon: "trophy" },
    { id: "routes", label: "Route Completion", icon: "check-circle" },
  ];

  return (
    <div className={s.profileContainer}>
      {/* Header */}
      <div className={s.profileHeader}>
        <button onClick={() => router.back()} className={s.backButton}>
          Back
        </button>

        <div className={s.playerInfo}>
          <div className={s.avatarContainer}>
            <div className={s.avatar}>
              <svg>
                <use href="/icons-sprite.svg#users" />
              </svg>

              {((leaderboardPositions.length > 0 &&
                leaderboardPositions[0].country_code) ||
                performanceStats?.country_code) && (
                <CountryImage
                  countryCode={
                    leaderboardPositions.length > 0
                      ? leaderboardPositions[0].country_code
                      : performanceStats.country_code
                  }
                  countryName={
                    leaderboardPositions.length > 0
                      ? leaderboardPositions[0].country
                      : performanceStats.country
                  }
                  size={24}
                />
              )}
            </div>
          </div>

          <div className={s.playerDetails}>
            <h1 className={s.playerName}>
              {getColoredName(getPlayerName())}
              {performanceStats?.admin_level > 0 && (
                <span className={s.adminBadge}>
                  Admin {performanceStats.admin_level}
                </span>
              )}
            </h1>

            <div className={s.playerMeta}>
              <span className={s.playerSteamId}>ID: {playerId}</span>

              {performanceStats?.last_seen && (
                <span className={s.metaItem}>
                  <span
                    className={
                      performanceStats.is_online ? s.online : s.offline
                    }
                  >
                    {performanceStats.is_online
                      ? "Online"
                      : formatLastSeen(performanceStats.last_seen)}
                  </span>
                </span>
              )}

              <div className={s.playerBadges}>
                <PlayerBadges
                  adminLevel={performanceStats?.admin_level}
                  banned={playerInfo?.banned}
                  donated={playerInfo?.donated}
                  id={playerId}
                  name={getPlayerName()}
                  lastSeen={performanceStats?.last_seen}
                  playerSince={playerInfo?.created_at}
                  score={performanceStats?.score}
                  averageScore={performanceStats?.average_score}
                  top10Ids={performanceStats?.top10_ids || []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={s.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${s.tabButton} ${activeTab === tab.id ? s.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg>
              <use href={`/icons-sprite.svg#${tab.icon}`} />
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={s.tabContent}>
        {/* Overview Tab */}
        {activeTab === "overview" && (
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
                          {Math.round(
                            performanceStats.maps_completed_ratio * 100
                          )}
                          % completion rate
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
                          <div className={s.infoLabel}>
                            Oldest standing record
                          </div>
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
                            {formatDate(
                              performanceStats.oldest_top.finish_date
                            )}
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
                        <div className={s.infoValue}>
                          Limited Data Available
                        </div>
                        <div className={s.infoSubtext}>
                          This player has insufficient data for detailed
                          statistics
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
                          const order = [
                            "125",
                            "250",
                            "333",
                            "76",
                            "43",
                            "mix",
                          ];
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
                        <span className={s.fpsSummaryLabel}>
                          Total Top Runs
                        </span>
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
                    <div key={index} className={s.recentActivityItem}>
                      <div className={s.activityIcon}>
                        <svg>
                          <use href="/icons-sprite.svg#star" />
                        </svg>
                      </div>
                      <div className={s.activityContent}>
                        <div className={s.activityTitle}>{run.map_name}</div>
                        <div className={s.activityDetails}>
                          <span className={s.activityRank}>
                            Rank #{run.rank}
                          </span>
                          <span className={s.activityFps}>{run.fps} FPS</span>
                          <span className={s.activityDate}>
                            {formatDate(run.finish_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Runs Tab */}
        {activeTab === "tops" && (
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
                        {fps === "mix" ? "Mixed" : fps}
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
                        {processedRuns.map((run, index) => {
                          const scoreInfo = getScoreInfo(run);
                          const cardClass = scoreInfo.isMythical
                            ? s.mythical
                            : scoreInfo.isLegendary
                            ? s.legendary
                            : scoreInfo.isEpic
                            ? s.epic
                            : "";
                          return (
                            <div
                              key={`${run.run_id}-${index}`}
                              className={`${s.runCard} ${cardClass}`}
                            >
                              <div className={s.runCardHeader}>
                                <div
                                  className={`${s.runRank} ${
                                    s[getRankCategory(run.rank)]
                                  }`}
                                >
                                  <span className={s.rankNumber}>
                                    {run.rank}
                                  </span>
                                  <div className={s.rankSubInfo}>
                                    <span className={s.rankSeparator}>/</span>
                                    <span className={s.rankTotal}>
                                      {run.totalNr}
                                    </span>
                                  </div>
                                </div>
                                <div className={s.runInfo}>
                                  <h3
                                    className={
                                      run.mapname.length > 20 ? s.longName : ""
                                    }
                                    title={run.mapname}
                                  >
                                    {run.mapname}
                                  </h3>
                                  <div className={s.runDetails}>
                                    <span className={s.runFps}>
                                      {run.fps} FPS
                                    </span>
                                    {run.difficulty && (
                                      <span className={s.runDifficulty}>
                                        Map Difficulty:{" "}
                                        {run.difficulty.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className={s.runStats}>
                                <div className={s.runScore}>
                                  <span className={s.statLabel}>Score:</span>
                                  <span
                                    className={`${s.statValue} ${
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
                                </div>
                                <div className={s.runTime}>
                                  <span className={s.statLabel}>Time:</span>
                                  <span className={s.statValue}>
                                    {formatTime(run.time_played_string)}
                                  </span>
                                </div>
                                <div className={s.runDate}>
                                  <span className={s.statLabel}>Date:</span>
                                  <span className={s.statValue}>
                                    {formatDate(run.time_created)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className={s.emptyState}>
                      <svg>
                        <use href="/icons-sprite.svg#star" />
                      </svg>
                      <p>No runs found for the selected filters.</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Ranks Tab */}
        {activeTab === "leaderboards" && (
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
                          onClick={() => selectLeaderboardFps(fps)}
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
                      <svg>
                        <use href="/icons-sprite.svg#trophy" />
                      </svg>
                      <p>
                        No leaderboard positions found for the selected FPS
                        filters.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Route Completion Tab */}
        {activeTab === "routes" && (
          <div className={s.routeCompletionTab}>
            <PlayerRouteCompletion playerId={playerId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;

// TODO: Fix Player details page sprite icons
