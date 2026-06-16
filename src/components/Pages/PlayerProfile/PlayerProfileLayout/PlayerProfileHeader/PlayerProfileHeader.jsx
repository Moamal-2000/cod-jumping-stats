"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import PlayerBadges from "@/components/Pages/PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import AdminLevel from "@/components/Shared/AdminLevel/AdminLevel";
import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import { useSelector } from "react-redux";
import PlayerProfileButton from "./PlayerProfileButton/PlayerProfileButton";
import s from "./PlayerProfileHeader.module.scss";

const PlayerProfileHeader = ({ playerData, playerId }) => {
  const jumpScores = useSelector((s) => s.playerProfile.jumpScores);

  const { countryCode, playerName, lastSeen, adminLevel, isBanned, isDonated } =
    getPlayerInfo({ playerData, jumpScores });

  return (
    <section className={s.profileHeader}>
      <div className={s.playerInfo}>
        <div className={s.avatar}>
          {countryCode && (
            <CountryImage
              countryCode={countryCode}
              countryName={jumpScores?.Country}
              colorPlaceholder={true}
              size={24}
            />
          )}
        </div>

        <div className={s.playerDetails}>
          <div className={s.playerNameAndButton}>
            <h1 className={s.playerName}>{getColoredName(playerName)}</h1>
            <PlayerProfileButton playerId={playerId} />
          </div>

          <div className={s.playerMeta}>
            <div className={s.main}>
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
