"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import PlayerBadges from "@/components/Pages/PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import AdminLevel from "@/components/Shared/AdminLevel/AdminLevel";
import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import { useSelector } from "react-redux";
import s from "./PlayerProfileHeader.module.scss";

const PlayerProfileHeader = ({ playerData, playerId }) => {
  const jumpScores = useSelector((s) => s.playerProfile.jumpScores);

  const { countryCode, playerName, lastSeen, adminLevel, isBanned, isDonated } =
    getPlayerInfo({ playerData, jumpScores });

  return (
    <section className={s.profileHeader}>
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
          <h1 className={s.playerName}>{getColoredName(playerName)}</h1>

          <div className={s.playerMeta}>
            <span className={s.playerSteamId}>ID: {playerId}</span>
            <span className={s.adminBadge}>
              <AdminLevel adminLevel={adminLevel} />
            </span>

            <div className={s.playerBadges}>
              <PlayerBadges
                Admin={adminLevel}
                Banned={isBanned}
                Donated={isDonated}
                LastSeen={lastSeen}
                PlayerID={+playerId}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
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
