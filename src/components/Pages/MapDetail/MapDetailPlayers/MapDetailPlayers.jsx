import { getColoredName } from "@/components/Helper/playerNameColor";
import { getModifiedRank } from "@/components/Helper/rankBadge";
import Link from "next/link";
import s from "./MapDetailPlayers.module.scss";

const MapDetailPlayers = ({
  playersData,
  selectedFps,
  loading,
  loadingMore,
  hasMore,
  loadMoreRef,
  showingAll,
  onShowAll,
  allData,
}) => {
  const formatPlaytime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className={s.playersCard}>
        <div className={s.cardHeader}>
          <h2>
            Most Played{" "}
            {selectedFps === "All" ? "(All FPS)" : `(${selectedFps} FPS)`}
          </h2>
        </div>
        <div className={s.loading}>
          <div className={s.spinner}></div>
          <span>Loading player data...</span>
        </div>
      </div>
    );
  }

  if (!playersData || playersData.length === 0) {
    return (
      <div className={s.playersCard}>
        <div className={s.cardHeader}>
          <h2>
            Most Played{" "}
            {selectedFps === "All" ? "(All FPS)" : `(${selectedFps} FPS)`}
          </h2>
        </div>
        <div className={s.noData}>
          <p>No players available for {selectedFps} FPS</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.playersCard}>
      <div className={s.cardHeader}>
        <h2>
          Most Played{" "}
          {selectedFps === "All" ? "(All FPS)" : `(${selectedFps} FPS)`}
        </h2>
        <div className={s.headerActions}>
          <span className={s.totalPlayers}>
            {selectedFps === "All"
              ? "Combined players"
              : `${playersData.length} players`}
          </span>
          {!showingAll && allData && allData.length > playersData.length && (
            <button className={s.showAllButton} onClick={onShowAll}>
              Show All ({allData.length})
            </button>
          )}
        </div>
      </div>

      <div className={s.playersList}>
        {playersData.map((player, index) => {
          const modifiedRank = getModifiedRank(index + 1);

          return (
            <Link
              href={`/player/${player.PlayerID}`}
              key={`${player.PlayerID}-${index}`}
              className={s.playerItem}
            >
              <div className={s.rank}>{modifiedRank}</div>

              <div className={s.playerInfo}>
                <div className={s.playerName}>
                  <span>{getColoredName(player.PlayerName)}</span>
                  {selectedFps === "All" &&
                    player.FPSList &&
                    player.FPSList.length > 0 && (
                      <span className={s.fpsDisplay}>
                        {player.FPSList
                          .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                          .join(", ")}{" "}
                        FPS
                      </span>
                    )}
                </div>
                <div className={s.playerId}>ID: {player.PlayerID}</div>
              </div>

              <div className={s.playtime}>
                <div className={s.playtimeValue}>
                  {formatPlaytime(player.TimePlayed)}
                </div>
                <div className={s.playtimeLabel}>Playtime</div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className={s.loadMoreContainer}>
          {loadingMore ? (
            <div className={s.loadingIndicator}>
              <div className={s.spinner}></div>
              <span>Loading more players...</span>
            </div>
          ) : (
            <div className={s.scrollHint}>
              <span>Scroll down to load more players</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapDetailPlayers;
