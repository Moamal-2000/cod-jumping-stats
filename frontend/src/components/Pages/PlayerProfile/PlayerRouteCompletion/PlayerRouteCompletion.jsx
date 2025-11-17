"use client";

import { fetchPlayerRouteCompletionNew } from "@/redux/features/playerProfile/thunk/playerRouteCompletionThunk";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import s from "./PlayerRouteCompletion.module.scss";

const PlayerRouteCompletion = () => {
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState("mapname"); // "mapname", "finishers"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc", "desc"
  const [activeList, setActiveList] = useState("completed"); // "completed", "not_completed"

  // Mock data for now - will be replaced with Redux state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completionData, setCompletionData] = useState(null);

  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  useEffect(() => {
    if (playerId) fetchData();
  }, [playerId]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(
        fetchPlayerRouteCompletionNew({
          playerId: parseInt(playerId),
        })
      );

      if (result.payload) {
        setCompletionData(result.payload);
      } else {
        setError("Failed to fetch route completion data");
      }
    } catch (err) {
      setError("Error fetching route completion data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  function getSortedData(data) {
    if (!data) return [];

    const sorted = [...data];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "mapname":
          comparison = a.mapname.localeCompare(b.mapname);
          break;
        case "finishers":
          comparison = a.individual_finish_count - b.individual_finish_count;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }

  function getRarityLevel(finishCount) {
    if (finishCount <= 2) return "mythical";
    if (finishCount <= 10) return "legendary";
    if (finishCount <= 20) return "epic";
    if (finishCount <= 30) return "rare";
    if (finishCount <= 50) return "uncommon";
    return "common";
  }

  function getRarityInfo(finishCount) {
    const level = getRarityLevel(finishCount);
    const rarityMap = {
      mythical: { label: "MYTHICAL", color: "#ff0080", glow: "#ff0080" },
      legendary: { label: "LEGENDARY", color: "#ff6b35", glow: "#ff6b35" },
      epic: { label: "EPIC", color: "#9d4edd", glow: "#9d4edd" },
      rare: { label: "RARE", color: "#3a86ff", glow: "#3a86ff" },
      uncommon: { label: "UNCOMMON", color: "#06ffa5", glow: "#06ffa5" },
      common: { label: "COMMON", color: "#9ca3af", glow: "#9ca3af" },
    };
    return rarityMap[level];
  }

  function getCompletionRateRarity(completionRate) {
    // Remove % sign and convert to number
    const rate = parseFloat(completionRate.replace("%", ""));
    if (rate >= 95) return "mythical";
    if (rate >= 85) return "legendary";
    if (rate >= 70) return "epic";
    if (rate >= 50) return "rare";
    if (rate >= 25) return "uncommon";
    return "common";
  }

  function getCompletionRateInfo(completionRate) {
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
  }

  if (loading) {
    return (
      <div className={s.loadingContainer}>
        <div className={s.loadingSpinner}></div>
        <p>Loading route completion data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.errorContainer}>
        <h2>Error Loading Route Completion</h2>
        <p>{error}</p>
        <button onClick={fetchData} className={s.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (!completionData) {
    return (
      <div className={s.emptyState}>
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#map" />
        </svg>
        <p>No route completion data available.</p>
      </div>
    );
  }

  const completedRoutes = getSortedData(completionData?.completedMaps || []);
  const notCompletedRoutes = getSortedData(
    completionData?.notCompletedMaps || []
  );

  return (
    <div className={s.routeCompletionContainer}>
      {/* Header with stats */}
      <div className={s.statsHeader}>
        <div className={s.statsCard}>
          <div className={s.statItem}>
            <span className={s.statLabel}>Total Routes</span>
            <span className={s.statValue}>
              {completionData.totalAvailableMaps}
            </span>
          </div>
          <div className={s.statItem}>
            <span className={s.statLabel}>Completed</span>
            <span className={s.statValue}>
              {completionData.completedMapsCount}
            </span>
          </div>
          <div className={s.statItem}>
            <span className={s.statLabel}>Completion Rate</span>
            <span
              className={s.statValue}
              style={{
                color: getCompletionRateInfo(completionData.completionRate)
                  .color,
                textShadow: `0 0 8px ${
                  getCompletionRateInfo(completionData.completionRate).glow
                }`,
              }}
            >
              {completionData.completionRate}
            </span>
          </div>
        </div>
      </div>

      {/* List Toggle */}
      <div className={s.listToggle}>
        <button
          className={`${s.toggleButton} ${
            activeList === "completed" ? s.active : ""
          }`}
          onClick={() => setActiveList("completed")}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#check-circle" />
          </svg>
          <span>Completed Routes ({completedRoutes.length})</span>
        </button>
        <button
          className={`${s.toggleButton} ${
            activeList === "not_completed" ? s.active : ""
          }`}
          onClick={() => setActiveList("not_completed")}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#x-circle" />
          </svg>
          <span>Not Completed Routes ({notCompletedRoutes.length})</span>
        </button>
      </div>

      {/* Controls */}
      <div className={s.controls}>
        <div className={s.controlGroup}>
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={s.sortSelect}
          >
            <option value="mapname">Route Name</option>
            <option value="finishers">Finisher Count</option>
          </select>
        </div>

        <div className={s.controlGroup}>
          <label>Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={s.orderSelect}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Rarity Legend */}
      <div className={s.legend}>
        <h4>Rarity Legend:</h4>
        <div className={s.legendItems}>
          <div className={s.legendItem}>
            <div className={`${s.legendColor} ${s.mythical}`}></div>
            <span>Mythical (0-2 finishers)</span>
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendColor} ${s.legendary}`}></div>
            <span>Legendary (3-10 finishers)</span>
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendColor} ${s.epic}`}></div>
            <span>Epic (11-20 finishers)</span>
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendColor} ${s.rare}`}></div>
            <span>Rare (21-30 finishers)</span>
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendColor} ${s.uncommon}`}></div>
            <span>Uncommon (31-50 finishers)</span>
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendColor} ${s.common}`}></div>
            <span>Common (50+ finishers)</span>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className={s.routesList}>
        {activeList === "completed" ? (
          completedRoutes.length > 0 ? (
            completedRoutes.map((map, index) => {
              const rarityInfo = getRarityInfo(map.individual_finish_count);
              const rarityLevel = getRarityLevel(map.individual_finish_count);
              return (
                <Link
                  href={`/map?mapid=${map.cp_id}`}
                  key={`${map.mapid}-${map.mapname}-${index}`}
                  className={`${s.mapCard} ${s.completed} ${
                    s[rarityLevel] || ""
                  }`}
                >
                  <div className={s.mapInfo}>
                    <div className={s.mapHeader}>
                      <h3 className={s.mapName}>{map.mapname}</h3>
                      <div className={s.mapMeta}>
                        <span className={s.mapAuthor}>by {map.author}</span>
                        <span className={s.mapReleased}>{map.released}</span>
                      </div>
                    </div>

                    <div className={s.mapDetails}>
                      <div className={s.finisherCount}>
                        <span className={s.finisherLabel}>Finishers:</span>
                        <span
                          className={s.finisherValue}
                          style={{ color: rarityInfo.color }}
                        >
                          {map.individual_finish_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className={s.emptyState}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#check-circle" />
              </svg>
              <p>No completed routes found.</p>
            </div>
          )
        ) : notCompletedRoutes.length > 0 ? (
          notCompletedRoutes.map((map, index) => {
            const rarityInfo = getRarityInfo(map.individual_finish_count);
            const rarityLevel = getRarityLevel(map.individual_finish_count);
            return (
              <Link
                href={`/map?mapid=${map.cp_id}`}
                key={`${map.mapid}-${map.mapname}-${index}`}
                className={`${s.mapCard} ${s.notCompleted} ${
                  s[rarityLevel] || ""
                }`}
              >
                <div className={s.mapInfo}>
                  <div className={s.mapHeader}>
                    <h3 className={s.mapName}>{map.mapname}</h3>
                    <div className={s.mapMeta}>
                      <span className={s.mapAuthor}>by {map.author}</span>
                      <span className={s.mapReleased}>{map.released}</span>
                    </div>
                  </div>

                  <div className={s.mapDetails}>
                    <div className={s.finisherCount}>
                      <span className={s.finisherLabel}>Finishers:</span>
                      <span
                        className={s.finisherValue}
                        style={{ color: rarityInfo.color }}
                      >
                        {map.individual_finish_count}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={s.emptyState}>
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#x-circle" />
            </svg>
            <p>No uncompleted routes found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerRouteCompletion;
