"use client";

import Breadcrumbs from "@/Components/Shared/Breadcrumbs/Breadcrumbs";
import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/Functions/components";
import { stripColorCodes } from "@/Functions/utils";
import {
  clearPlayerProfile,
  setPlayerInfo,
  updatePlayerProfileState,
} from "@/Redux/slices/playerProfileSlice";
import {
  fetchPlayerJumpScores,
  fetchPlayerLeaderboardPositions,
  fetchPlayerProfile,
  fetchPlayerTops,
} from "@/Redux/thunks/playerProfileThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerBadges from "../../PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import s from "./PlayerProfileLayout.module.scss";
import PlayerProfileTabs from "./playerProfileTabs/playerProfileTabs";

const PlayerProfileLayout = ({ children }) => {
  const {
    playerInfo,
    performanceStats,
    leaderboardPositions,
    topRuns,
    jumpScores,
  } = useSelector((s) => s.playerProfile);
  const playersData = useSelector((s) => s.players.playersData);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  const breadcrumbLabels = [
    "Home",
    "Players",
    stripColorCodes(getPlayerName()),
  ];
  const breadcrumbPaths = [
    { index: 0, path: "/" },
    { index: 1, path: `/players` },
  ];

  function getPlayerName() {
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
  }

  useEffect(() => {
    if (playerId) {
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
      dispatch(
        updatePlayerProfileState({ key: "currentFetchingFps", value: "125" })
      );
      dispatch(fetchPlayerTops({ playerId, fps: "125" })); // Start with 125 FPS
      dispatch(fetchPlayerJumpScores({ playerId, fps: "125" }));
    }
  }, [dispatch, playerId]);
  return (
    <main className={s.playerPage}>
      <div className={s.playerProfile}>
        <Breadcrumbs
          breadcrumbLabels={breadcrumbLabels}
          breadcrumbPaths={breadcrumbPaths}
        />

        <div className={s.profileContainer}>
          {/* Header */}
          <div className={s.profileHeader}>
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
                  {performanceStats?.admin_level >= 0 && (
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
                      banned={performanceStats?.is_banned}
                      donated={performanceStats?.is_donator}
                      lastSeen={jumpScores?.last_seen}
                      id={playerId}
                      name={getPlayerName()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PlayerProfileTabs />
          {children}
        </div>
      </div>
    </main>
  );
};

export default PlayerProfileLayout;
