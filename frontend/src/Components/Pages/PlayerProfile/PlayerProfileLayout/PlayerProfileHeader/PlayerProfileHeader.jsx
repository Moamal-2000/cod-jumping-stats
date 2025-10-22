"use client";

import PlayerBadges from "@/Components/Pages/PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/Functions/components";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import s from "./PlayerProfileHeader.module.scss";

const PlayerProfileHeader = () => {
  const { performanceStats, leaderboardPositions, jumpScores } = useSelector(
    (s) => s.playerProfile
  );

  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  return (
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
            {getColoredName(jumpScores?.player_name)}
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
                  className={performanceStats.is_online ? s.online : s.offline}
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
                name={jumpScores?.player_name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileHeader;
