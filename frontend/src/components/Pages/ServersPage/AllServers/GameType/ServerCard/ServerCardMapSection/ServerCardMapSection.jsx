import Link from "next/link";
import s from "./ServerCardMap.module.scss";

const ServerCardMapSection = ({ server }) => {
  const isCod4 = server.GameType === "COD4";

  return (
    <div className={s.mapInfo}>
      <span className={s.mapLabel}>
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#globe" />
        </svg>{" "}
        Map
      </span>

      {isCod4 && <span className={s.mapName}>{server.Map}</span>}

      {!isCod4 && (
        <Link href={`/map?mapid=${server.MapID}`} className={s.mapName}>
          {server.Map}
        </Link>
      )}
    </div>
  );
};

export default ServerCardMapSection;
