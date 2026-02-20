"use client";

import { fetchPlayerRouteCompletionNew } from "@/redux/features/playerProfile/thunk/playerRouteCompletionThunk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayerRouteCompletion.module.scss";

const PlayerRouteCompletion = ({ playerId }) => {
  const [sortBy, setSortBy] = useState("mapname"); // "mapname", "finishers"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc", "desc"
  const [activeList, setActiveList] = useState("completed"); // "completed", "not_completed"

  // Mock data for now - will be replaced with Redux state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completionData, setCompletionData] = useState(null);

  const allPlayersData = useSelector((s) => s.players.allPlayersData);
  const allPlayersLength = allPlayersData.length || 0;

  const dispatch = useDispatch();

  useEffect(() => {
    if (playerId) fetchData();
  }, [playerId]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(
        fetchPlayerRouteCompletionNew({ playerId: parseInt(playerId, 10) }),
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

  function renderMapRow(map, index, isCompleted) {
    const rarityLevel = getRarityLevel(map.individual_finish_count);

    return (
      <tr
        key={`${map.mapid}-${map.mapname}-${index}`}
        className={`${s.tableRow} ${s[rarityLevel] || ""}`}
      >
        <td className={s.mapNameCell}>
          <Link href={`/map?mapid=${map.cp_id}`} className={s.mapLink}>
            {map.mapname}
          </Link>
        </td>
        <td className={s.authorCell}>{map.author}</td>
        <td className={s.releasedCell}>{map.released}</td>
        <td className={s.finisherCell}>
          <span className={s.finisherBadge}>
            {map.individual_finish_count} / {allPlayersLength}
          </span>
        </td>
        <td className={s.statusCell}>
          {isCompleted ? (
            <span className={s.completedBadge}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#check-circle" />
              </svg>
              Completed
            </span>
          ) : (
            <span className={s.notCompletedBadge}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#x-circle" />
              </svg>
              Not Completed
            </span>
          )}
        </td>
      </tr>
    );
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
      <div className={s.errorContainer} role="alert" aria-live="polite">
        <div className={s.errorIcon} />
        <h2 className={s.errorTitle}>Route Completion Unavailable</h2>
        <p className={s.errorMessage}>{error}</p>
        <p className={s.errorHint}>
          The profile data service may be temporarily unavailable. Retry in a
          moment.
        </p>
        <button onClick={fetchData} className={s.retryButton}>
          Retry Loading
        </button>
      </div>
    );
  }

  if (!completionData) {
    return (
      <div className={s.emptyState}>
        <div className={s.emptyIcon}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#map" />
          </svg>
        </div>
        <h2 className={s.emptyTitle}>No Route Data Yet</h2>
        <p className={s.emptyHint}>
          This player does not have route completion records yet.
        </p>
      </div>
    );
  }

  const completedRoutes = getSortedData({
    data: completionData?.completedMaps || [],
    sortBy,
    sortOrder,
  });
  const notCompletedRoutes = getSortedData({
    data: completionData?.notCompletedMaps || [],
    sortBy,
    sortOrder,
  });

  const activeListData =
    activeList === "completed" ? completedRoutes : notCompletedRoutes;

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

      {/* Routes Table */}
      <div className={s.routesTableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Map Name</th>
              <th>Author</th>
              <th>Released</th>
              <th>Finishers</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeListData.map((map, index) => renderMapRow(map, index, true))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerRouteCompletion;

const rarityMap = {
  mythical: { color: "#ff0080" },
  legendary: { color: "#ff6b35" },
  epic: { color: "#a73bff" },
  rare: { color: "#3a86ff" },
  uncommon: { color: "#06ffa5" },
  common: { color: "#9ca3af" },
};

function getRarityLevel(finishCount) {
  if (finishCount <= 2) return "mythical";
  if (finishCount <= 10) return "legendary";
  if (finishCount <= 20) return "epic";
  if (finishCount <= 30) return "rare";
  if (finishCount <= 50) return "uncommon";
  return "common";
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
  return rarityMap[rarity];
}

function getSortedData({ data, sortBy, sortOrder }) {
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
