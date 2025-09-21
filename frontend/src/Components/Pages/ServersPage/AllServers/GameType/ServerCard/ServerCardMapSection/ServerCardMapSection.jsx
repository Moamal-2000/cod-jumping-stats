import SvgIcon from "@/Components/Shared/SvgIcon";
import Link from "next/link";
import s from "./ServerCard.module.scss";

const ServerCardMapSection = ({ server }) => {
  const isCod4 = server.game_type === "COD4";

  return (
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
  );
};

export default ServerCardMapSection;
