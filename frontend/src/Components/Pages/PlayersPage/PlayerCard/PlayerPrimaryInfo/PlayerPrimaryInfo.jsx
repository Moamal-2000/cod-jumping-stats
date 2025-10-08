import { getColoredName } from "@/Functions/components";
import Link from "next/link";
import s from "./PlayerPrimaryInfo.module.scss";

const PlayerPrimaryInfo = ({ name, rank, adminLevel, id }) => {
  return (
    <div className={s.primaryInfo}>
      <Link href={`/player/${id || rank}`} className={s.playerName}>
        {getColoredName(name)}
      </Link>

      <div className={s.wrapper}>
        <span className={s.playerId}>#{id}</span>

        <div className={s.adminLevel}>
          <svg>
            <use href="/icons-sprite.svg#shield" />
          </svg>
          <span>{adminLevel}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerPrimaryInfo;
