"use client";

import SvgIcon from "@/Components/Shared/SvgIcon";
import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./ServerCard.module.scss";
import ServerCardHeader from "./ServerCardHeader/ServerCardHeader";
import ServerCardMapSection from "./ServerCardMapSection/ServerCardMapSection";

const ServerCard = ({ server }) => {
  const hasPlayers =
    server.online && server.players && server.players.length > 0;
  const isCod4 = server.game_type === "COD4";

  return (
    <div key={`${server.ip}-${server.port}`} className={s.serverCard}>
      <ServerCardHeader server={server} />
      <ServerCardMapSection server={server} isCod4={isCod4} />

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
