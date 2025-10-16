import { getColoredName } from "@/Functions/components";
import { stripColorCodes } from "@/Functions/utils";
import Link from "next/link";
import s from "./OnlinePlayerItem.module.scss";

const OnlinePlayerItem = ({ player, server }) => {
  const isCod4 = server.GameType === "COD4";
  const coloredName = getColoredName(player.Name || "Unknown Player");
  const pureName = stripColorCodes(player.Name);

  function handleClick(event) {
    if (isCod4) event.preventDefault();
  }

  return (
    <Link
      href={`/player/${player.PlayerID}`}
      className={`${s.playerItem} ${isCod4 ? s.cod4 : ""}`}
      onClick={handleClick}
    >
      <strong className={s.playerName}>
        <span className="visually-hidden">Player </span>
        {coloredName}
      </strong>

      <div className={s.playerInfo}>
        <span className={s.playerAdminLevel}>
          <svg>
            <use href="/icons-sprite.svg#shield" />
          </svg>{" "}
          {player?.Admin || "N/A"}
          <span className="visually-hidden">Admin Level</span>
        </span>

        <span className={s.playerPing}>
          <svg>
            <use href="/icons-sprite.svg#ping" />
          </svg>{" "}
          {player?.Ping || 0}ms
        </span>
      </div>
    </Link>
  );
};

export default OnlinePlayerItem;
