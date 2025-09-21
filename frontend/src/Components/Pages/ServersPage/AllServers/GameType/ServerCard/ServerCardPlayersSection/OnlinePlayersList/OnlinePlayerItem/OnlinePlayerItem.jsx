import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./OnlinePlayerItem.module.scss";
import SvgIcon from "@/Components/Shared/SvgIcon";

const OnlinePlayerItem = ({ player, server }) => {
  const isCod4 = server.game_type === "COD4";

  return (
    <Link
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
  );
};

export default OnlinePlayerItem;
