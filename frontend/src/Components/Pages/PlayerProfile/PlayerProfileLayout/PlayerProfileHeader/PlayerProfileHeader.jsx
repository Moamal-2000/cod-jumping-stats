"use client";

import PlayerBadges from "@/components/Pages/PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/functions/components";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import s from "./PlayerProfileHeader.module.scss";

const PlayerProfileHeader = ({ playerData }) => {
  const jumpScores = useSelector((s) => s.playerProfile.jumpScores);

  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  const { countryCode, playerName, lastSeen, adminLevel, isBanned, isDonated } =
    getPlayerInfo({ playerData, jumpScores });

  return (
    <div className={s.profileHeader}>
      <div className={s.playerInfo}>
        <div className={s.avatarContainer}>
          <div className={s.avatar}>
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#users" />
            </svg>

            {countryCode && (
              <CountryImage
                countryCode={countryCode}
                countryName={jumpScores?.Country}
                size={24}
              />
            )}
          </div>
        </div>

        <div className={s.playerDetails}>
          <h1 className={s.playerName}>
            {getColoredName(playerName)}
            {adminLevel >= 0 && (
              <span className={s.adminBadge}>Admin {adminLevel}</span>
            )}
          </h1>

          <div className={s.playerMeta}>
            <span className={s.playerSteamId}>ID: {playerId}</span>

            <div className={s.playerBadges}>
              <PlayerBadges
                Admin={adminLevel}
                Banned={isBanned}
                Donated={isDonated}
                LastSeen={lastSeen}
                PlayerID={playerId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileHeader;

function getPlayerInfo({ playerData, jumpScores }) {
  return {
    countryCode: playerData?.Country || jumpScores?.CountryCode,
    playerName:
      playerData?.PrefName || playerData?.PlayerName || jumpScores?.PlayerName,
    lastSeen: playerData?.LastSeen || jumpScores?.LastSeen,
    adminLevel: playerData?.Admin,
    isBanned: playerData?.Banned === 1,
    isDonated: playerData?.Donated === 1,
  };
}
