"use client";

import PlayerBadges from "@/Components/Pages/PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/Functions/components";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import s from "./PlayerProfileHeader.module.scss";

const PlayerProfileHeader = () => {
  const { performanceStats, jumpScores } = useSelector((s) => s.playerProfile);

  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  return (
    <div className={s.profileHeader}>
      <div className={s.playerInfo}>
        <div className={s.avatarContainer}>
          <div className={s.avatar}>
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#users" />
            </svg>

            {jumpScores?.country && (
              <CountryImage
                countryCode={jumpScores.country_code}
                countryName={jumpScores.country}
                size={24}
              />
            )}
          </div>
        </div>

        <div className={s.playerDetails}>
          <h1 className={s.playerName}>
            {getColoredName(jumpScores?.player_name)}
            {performanceStats?.AdminLevel >= 0 && (
              <span className={s.adminBadge}>
                Admin {performanceStats.AdminLevel}
              </span>
            )}
          </h1>

          <div className={s.playerMeta}>
            <span className={s.playerSteamId}>ID: {playerId}</span>

            <div className={s.playerBadges}>
              <PlayerBadges
                Admin={performanceStats?.AdminLevel}
                Banned={performanceStats?.IsBanned}
                Donated={performanceStats?.IsDonator}
                LastSeen={jumpScores?.last_seen}
                PlayerID={playerId}
                PlayerName={jumpScores?.player_name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileHeader;
