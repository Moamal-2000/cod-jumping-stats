import SvgIcon from "@/Components/Shared/SvgIcon";
import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./OnlinePlayerItem.module.scss";

const OnlinePlayerItem = ({ player, server }) => {
  const isCod4 = server.GameType === "COD4";
  const playerName = getColoredName(player.Name || "Unknown Player");

  function handleClick(event) {
    if (isCod4) event.preventDefault();
  }

  return (
    <Link
      href={`/player/${player.PlayerID}`}
      className={`${s.playerItem} ${isCod4 ? s.cod4 : ""}`}
      onClick={handleClick}
    >
      <strong className={s.playerName}>{playerName}</strong>

      <div className={s.playerInfo}>
        <span className={s.playerAdminLevel}>
          <SvgIcon name="shield" /> {player?.Admin || "N/A"}
        </span>

        <span className={s.playerPing}>
          <SvgIcon name="ping" /> {player?.Ping || 0}ms
        </span>
      </div>
    </Link>
  );
};

export default OnlinePlayerItem;
