import Link from "next/link";
import s from "./ServerInfo.module.scss";

const ServerInfo = ({ server, viewType }) => {
  const isCod4 = server.GameType === "COD4";
  const isList = viewType === "list";
  const query = server?.Domain.includes("jump4life") ? "?source=j4l" : "";

  return (
    <section className={`${s.serverInfo} ${isList ? s.list : ""}`}>
      {!isList && (
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
      )}

      <div className={s.infoItem}>
        {!isList && (
          <span className={s.label}>
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#map" />
            </svg>{" "}
            Map
          </span>
        )}

        {isCod4 && <span className={s.mapName}>{server.Map}</span>}

        {!isCod4 && server.Online && (
          <Link href={`/map/${server.MapID}${query}`} className={s.mapName}>
            {server.Map}
          </Link>
        )}
      </div>
    </section>
  );
};

export default ServerInfo;
