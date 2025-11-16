import Link from "next/link";
import s from "./ServerInfo.module.scss";

const ServerInfo = ({ server }) => {
  const isCod4 = server.GameType === "COD4";

  return (
    <section className={s.serverInfo}>
      <div className={s.infoItem}>
        <span className={s.label}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#joystick" />
          </svg>{" "}
          Game
        </span>

        <span className={`${s.gameName} ${isCod4 ? s.cod4 : s.cod2}`}>
          {`Call of Duty ${isCod4 ? "4" : "2"}`}
        </span>
      </div>

      <div className={s.infoItem}>
        <span className={s.label}>
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
    </section>
  );
};

export default ServerInfo;
