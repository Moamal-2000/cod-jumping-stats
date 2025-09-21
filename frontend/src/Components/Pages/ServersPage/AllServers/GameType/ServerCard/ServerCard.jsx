"use client";

import SvgIcon from "@/Components/Shared/SvgIcon";
import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./ServerCard.module.scss";
import ServerCardHeader from "./ServerCardHeader/ServerCardHeader";

const ServerCard = ({ server }) => {
  const hasPlayers =
    server.online && server.players && server.players.length > 0;
  const isCod4 = server.game_type === "COD4";

  return (
    <div key={`${server.ip}-${server.port}`} className={s.serverCard}>
      <ServerCardHeader server={server} />

      {/* Map Information */}
      <div className={s.mapSection}>
        <div className={s.mapInfo}>
          <span className={s.mapLabel}>
            <SvgIcon name="globe" /> Map
          </span>

          {isCod4 && <span className={s.mapName}>{server.map}</span>}

          {!isCod4 && (
            <Link href={`/map/${server.mapid}`} className={s.mapName}>
              {server.map}
            </Link>
          )}
        </div>
      </div>

      {/* Players Section */}
      <div className={s.playersSection}>
        {hasPlayers && (
          <div className={s.playersList}>
            {server.players.map((player, index) => (
              <Link
                key={index}
                href={`/player/${player.playerid}`}
                className={`${s.playerItem} ${isCod4 ? s.cod4 : ""}`}
                onClick={(event) => (isCod4 ? event.preventDefault() : "")}
              >
                <div className={s.playerName}>
                  {getColoredName(player.playername || "Unknown Player")}
                </div>
                <div className={s.playerInfo}>
                  {player.admin && (
                    <span className={s.playerAdminLevel}>
                      <SvgIcon name="shield" /> {player.admin}
                    </span>
                  )}
                  {player.ping && (
                    <span className={s.playerPing}>
                      <SvgIcon name="ping" /> {player.ping}ms
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!hasPlayers && (
          <p className={s.noPlayersText}>This server is currently empty</p>
        )}
      </div>
    </div>
  );
};

export default ServerCard;
