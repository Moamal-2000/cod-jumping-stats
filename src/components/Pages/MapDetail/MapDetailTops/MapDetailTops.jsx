"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import { getModifiedRank } from "@/components/Helper/rankBadge";
import Link from "next/link";
import { useSelector } from "react-redux";
import s from "./MapDetailTops.module.scss";

const showingAll = false;

const MapDetailTops = ({ selectedFps }) => {
  const { mapTops, loadingTops } = useSelector((s) => s.map);

  if (loadingTops) {
    return (
      <div className={s.topsCard}>
        <div className={s.cardHeader}>
          <h2>
            Top Runs{" "}
            {selectedFps === "All" ? "(All FPS)" : `(${selectedFps} FPS)`}
          </h2>
        </div>
        <div className={s.loading}>
          <div className={s.spinner}></div>
          <span>Loading top runs...</span>
        </div>
      </div>
    );
  }

  if (!mapTops || mapTops.length === 0) {
    return (
      <div className={s.topsCard}>
        <div className={s.cardHeader}>
          <h2>
            Top Runs{" "}
            {selectedFps === "All" ? "(All FPS)" : `(${selectedFps} FPS)`}
          </h2>
        </div>
        <div className={s.noData}>
          <p>No runs available for {selectedFps} FPS</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.topsCard}>
      <div className={s.cardHeader}>
        <h2>
          Top Runs{" "}
          {selectedFps === "All" ? "(All FPS)" : `(${selectedFps} FPS)`}
        </h2>
        <div className={s.headerActions}>
          <span className={s.totalRuns}>
            {selectedFps === "All"
              ? "Combined runs"
              : `${mapTops[0]?.TotalNr || 0} total runs`}
          </span>
          {!showingAll && mapTops && mapTops.length > mapTops.length && (
            <button className={s.showAllButton} onClick={handleShowAllBtn}>
              Show All ({mapTops.length})
            </button>
          )}
        </div>
      </div>

      <div className={s.topsList}>
        {mapTops.map((run, index) => {
          const modifiedRank = getModifiedRank(run.Rank);

          return (
            <Link
              href={`/player/${run.PlayerID}`}
              key={`${run.RunID}-${index}`}
              className={s.topRun}
            >
              <div className={s.rank}>{modifiedRank}</div>

              <div className={s.playerInfo}>
                <div className={s.playerName}>
                  <span>{getColoredName(run.PlayerName)}</span>
                  {selectedFps === "All" && run.FPS && (
                    <span className={s.fpsDisplay}>{run.FPS} FPS</span>
                  )}
                </div>
                <div className={s.runDetails}>
                  <span className={s.time}>{run.TimePlayedString}</span>
                  <span className={s.separator}>•</span>
                  <span className={s.date}>
                    {new Date(run.TimeCreated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={s.stats}>
                <div className={s.stat}>
                  <span className={s.statLabel}>Loads</span>
                  <span className={s.statValue}>{run.LoadCount || 0}</span>
                </div>
                <div className={s.stat}>
                  <span className={s.statLabel}>Saves</span>
                  <span className={s.statValue}>{run.SaveCount || 0}</span>
                </div>
                <div className={s.stat}>
                  <span className={s.statLabel}>Nade Jumps</span>
                  <span className={s.statValue}>{run.Nadejumps || 0}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MapDetailTops;
