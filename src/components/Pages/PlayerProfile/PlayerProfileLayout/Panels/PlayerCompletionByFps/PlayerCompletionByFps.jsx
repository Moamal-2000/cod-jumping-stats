"use client";

import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { usePlayerRouteCompletion } from "@/hooks/app/usePlayerRouteCompletion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import s from "./PlayerCompletionByFps.module.scss";

const FPS_OPTIONS = ["43", "76", "125", "250", "333", "Mix"];

const PlayerCompletionByFps = ({ playerId }) => {
  const [selectedFps, setSelectedFps] = useState("125");
  const [filterMode, setFilterMode] = useState("completed"); // "completed" or "incomplete"

  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

  const { completionData, loading, error, refetch } =
    usePlayerRouteCompletion(playerId);
  const allPlayersData = useSelector((s) => s.players.allPlayersData);
  const allPlayersLength = allPlayersData.length || 0;

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
        <h2 className={s.errorTitle}>Completion by FPS Unavailable</h2>
        <p className={s.errorMessage}>{error}</p>
        <button onClick={refetch} className={s.retryButton}>
          Retry Loading
        </button>
      </div>
    );
  }

  if (!completionData || !completionData.playerMapDetails) {
    return (
      <div className={s.emptyState}>
        <div className={s.emptyIcon}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#map" />
          </svg>
        </div>
        <h2 className={s.emptyTitle}>No Route Data Available</h2>
        <p className={s.emptyHint}>
          This player does not have route completion records yet.
        </p>
      </div>
    );
  }

  // Get all completed maps
  const allCompletedMaps = completionData.completedMaps || [];

  // Filter completed maps by selected FPS
  const completedByFps = allCompletedMaps.filter((map) => {
    const playerDetails = completionData.playerMapDetails[map.MapName];
    if (!playerDetails || !playerDetails.FPSList) {
      return false;
    }

    // Parse FPSList (could be array or comma-separated string)
    const fpsList = Array.isArray(playerDetails.FPSList)
      ? playerDetails.FPSList
      : playerDetails.FPSList.toString()
          .split(",")
          .map((f) => f.trim());

    if (selectedFps === "Mix") {
      // For Mix, show maps completed with multiple different FPS values
      return fpsList.length > 1;
    } else {
      // Show maps completed with the specific FPS
      return fpsList.includes(selectedFps);
    }
  });

  // Get incomplete maps by finding the difference
  const allAvailableMaps = completionData.completionDetails || [];
  const incompleteByFps = allAvailableMaps.filter((map) => {
    // Map must not be completed with the selected FPS
    return !completedByFps.some(
      (completed) =>
        completed.MapID === map.MapID && completed.CpID === map.CpID,
    );
  });

  // Select which list to display
  const displayMaps =
    filterMode === "completed" ? completedByFps : incompleteByFps;
  const mapCount = displayMaps.length;

  return (
    <div
      className={s.completionByFpsPanel}
      id="player-profile-panel-completion-by-fps"
    >
      {/* Header with stats */}
      <div className={s.statsHeader}>
        <div className={s.statsCard}>
          <div className={s.statItem}>
            <span className={s.statLabel}>FPS</span>
            <span className={s.statValue}>{selectedFps}</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statLabel}>Maps</span>
            <span className={s.statValue}>{mapCount}</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statLabel}>Mode</span>
            <span className={s.statValue}>
              {filterMode === "completed" ? "Completed" : "Incomplete"}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={s.controls}>
        {/* FPS Selector */}
        <div className={s.fpsSelector}>
          <label htmlFor="fps-group">Jump FPS:</label>
          <div className={s.fpsButtons} role="group" id="fps-group">
            {FPS_OPTIONS.map((fps) => (
              <button
                key={fps}
                className={`${s.fpsButton} ${selectedFps === fps ? s.active : ""}`}
                onClick={() => setSelectedFps(fps)}
                aria-pressed={selectedFps === fps}
              >
                {fps}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Mode Toggle */}
        <div className={s.modeToggle}>
          <label htmlFor="filter-mode">Filter Mode:</label>
          <div className={s.toggleButtons} role="group" id="filter-mode">
            <button
              className={`${s.toggleButton} ${filterMode === "completed" ? s.active : ""}`}
              onClick={() => setFilterMode("completed")}
              aria-pressed={filterMode === "completed"}
            >
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#check-circle" />
              </svg>
              Completed
            </button>
            <button
              className={`${s.toggleButton} ${filterMode === "incomplete" ? s.active : ""}`}
              onClick={() => setFilterMode("incomplete")}
              aria-pressed={filterMode === "incomplete"}
            >
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#x-circle" />
              </svg>
              Missing
            </button>
          </div>
        </div>
      </div>

      {/* Maps Table */}
      {mapCount > 0 ? (
        <div className={s.mapsTableWrapper}>
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
              {displayMaps.map((map, index) => (
                <tr
                  key={`${map.MapID}-${map.mapName}-${index}`}
                  className={s.tableRow}
                >
                  <td className={s.mapNameCell}>
                    <TransitionLink
                      href={`/map/${map.CpID}${sourceParam === "jh" ? "" : `?source=${sourceParam}`}`}
                      className={s.mapLink}
                    >
                      {map.MapName}
                    </TransitionLink>
                  </td>
                  <td className={s.authorCell}>{map.Author || "Unknown"}</td>
                  <td className={s.releasedCell}>
                    {map.Released || "Unknown"}
                  </td>
                  <td className={s.finisherCell}>
                    <span className={s.finisherBadge}>
                      {map.IndividualFinishCount} / {allPlayersLength}
                    </span>
                  </td>
                  <td className={s.statusCell}>
                    {filterMode === "completed" ? (
                      <span className={s.completedBadge}>
                        <svg aria-hidden="true">
                          <use href="/icons-sprite.svg#check-circle" />
                        </svg>
                        Completed
                      </span>
                    ) : (
                      <span className={s.incompleteBadge}>
                        <svg aria-hidden="true">
                          <use href="/icons-sprite.svg#x-circle" />
                        </svg>
                        Missing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={s.noResults}>
          <div className={s.noResultsIcon}>
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#search" />
            </svg>
          </div>
          <h3 className={s.noResultsTitle}>No Maps Found</h3>
          <p className={s.noResultsMessage}>
            No {filterMode === "completed" ? "completed" : "missing"} maps found
            for FPS {selectedFps}.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerCompletionByFps;
