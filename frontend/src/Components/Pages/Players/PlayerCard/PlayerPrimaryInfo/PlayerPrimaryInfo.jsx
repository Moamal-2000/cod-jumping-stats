import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./PlayerPrimaryInfo.module.scss";

const PlayerPrimaryInfo = ({ name, rank, id }) => {
  return (
    <div className={s.primaryInfo}>
      <Link href={`/player/${id || rank}`} className={s.playerName}>
        {getColoredName(name)}
      </Link>
      <span className={s.playerId}>#{id}</span>
    </div>
  );
};

export default PlayerPrimaryInfo;
