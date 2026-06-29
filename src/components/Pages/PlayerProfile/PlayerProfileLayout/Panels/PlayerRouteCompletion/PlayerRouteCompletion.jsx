"use client";

import { usePlayerRouteCompletion } from "@/hooks/app/usePlayerRouteCompletion";
import { useState } from "react";
import s from "./PlayerRouteCompletion.module.scss";
import RouteCompletionTable from "./RouteCompletionTable/RouteCompletionTable";

const PlayerRouteCompletion = ({ playerId }) => {
  const [sortBy, setSortBy] = useState("mapname"); // "mapname", "finishers"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc", "desc"
  const [activeList, setActiveList] = useState("completed"); // "completed", "not_completed"

  const { completionData, loading, error, refetch } =
    usePlayerRouteCompletion(playerId);

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
        <button onClick={refetch} className={s.retryButton}>
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

  return (
    <div className={s.routeCompletionPanel} id="player-profile-panel-routes">
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

      {/* Controls */}
      <div className={s.controls}>
        <div className={s.filterButtons}>
          <button
            className={`${s.filterButton} ${
              activeList === "completed" ? s.active : ""
            }`}
            onClick={() => setActiveList("completed")}
          >
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#check-circle" />
            </svg>
            <span>Completed {completedRoutes.length}</span>
          </button>
          <button
            className={`${s.filterButton} ${
              activeList === "not_completed" ? s.active : ""
            }`}
            onClick={() => setActiveList("not_completed")}
          >
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#x-circle" />
            </svg>
            <span>Not Completed {notCompletedRoutes.length}</span>
          </button>
        </div>

        <div className={s.controlGroup}>
          <label htmlFor="sort-by">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={s.sortSelect}
            id="sort-by"
          >
            <option value="mapname">Route Name</option>
            <option value="finishers">Finisher Count</option>
          </select>
        </div>

        <div className={s.controlGroup}>
          <label htmlFor="order">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={s.orderSelect}
            id="order"
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
        <RouteCompletionTable
          completedRoutes={completedRoutes}
          notCompletedRoutes={notCompletedRoutes}
          activeList={activeList}
        />
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

function getCompletionRateRarity(completionRate) {
  // Remove % sign and convert to number
  const rate = parseFloat(completionRate.replace("%", ""));
  if (rate >= 95) {
    return "mythical";
  }
  if (rate >= 85) {
    return "legendary";
  }
  if (rate >= 70) {
    return "epic";
  }
  if (rate >= 50) {
    return "rare";
  }
  if (rate >= 25) {
    return "uncommon";
  }
  return "common";
}

function getCompletionRateInfo(completionRate) {
  const rarity = getCompletionRateRarity(completionRate);
  return rarityMap[rarity];
}

function getSortedData({ data, sortBy, sortOrder }) {
  if (!data) {
    return [];
  }

  const sorted = [...data];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "mapname":
        comparison = a.MapName.localeCompare(b.MapName);
        break;
      case "finishers":
        comparison = a.IndividualFinishCount - b.IndividualFinishCount;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
}
