import SvgIcon from "@/Components/Shared/SvgIcon";
import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./ServerCard.module.scss";

const ServerCardPlayersSection = ({ server, isCod4 }) => {
  const hasPlayers =
    server.online && server.players && server.players.length > 0;

  return (
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
  );
};

export default ServerCardPlayersSection;
