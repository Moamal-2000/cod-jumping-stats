import { getColoredName } from "@/components/Helper/playerNameColor";
import { getModifiedRank } from "@/components/Helper/rankBadge";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import s from "./MapDetailPlayers.module.scss";

const ITEMS_PER_PAGE = 10;

const MapDetailPlayers = ({ selectedFps }) => {
  const [displayedPlayersCount, setDisplayedPlayersCount] =
    useState(ITEMS_PER_PAGE);
  const [showingAll, setShowingAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  const { mapPlayers, loadingPlayers: loading } = useSelector((s) => s.map);

  const playersData = !Array.isArray(mapPlayers)
    ? []
    : showingAll
      ? mapPlayers
      : mapPlayers.slice(0, displayedPlayersCount);

  const hasMore =
    !showingAll &&
    Array.isArray(mapPlayers) &&
    displayedPlayersCount < mapPlayers.length;

  function onShowAll() {
    setShowingAll(true);
  }

  function loadMorePlayers() {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedPlayersCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, mapPlayers.length),
      );
      setLoadingMore(false);
    }, 120);
  }

  useEffect(() => {
    setDisplayedPlayersCount(ITEMS_PER_PAGE);
    setShowingAll(false);
  }, [mapPlayers, selectedFps]);

  useEffect(() => {
    if (!hasMore || playersData.length === 0) {
      return;
    }

    const playersObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePlayers();
        }
      },
      { threshold: 0.1 },
    );

    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current) {
        playersObserver.observe(loadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (loadMoreRef.current) {
        playersObserver.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, playersData.length, loadingMore]);

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
              : `${mapPlayers.length} players`}
          </span>
          {!showingAll && mapPlayers.length > playersData.length && (
            <button className={s.showAllButton} onClick={onShowAll}>
              Show All ({mapPlayers.length})
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
                        {[...player.FPSList]
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
