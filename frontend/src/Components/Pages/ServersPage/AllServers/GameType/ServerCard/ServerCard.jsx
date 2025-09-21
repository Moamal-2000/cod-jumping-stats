"use client";

import s from "./ServerCard.module.scss";
import ServerCardHeader from "./ServerCardHeader/ServerCardHeader";
import ServerCardMapSection from "./ServerCardMapSection/ServerCardMapSection";
import ServerCardPlayersSection from "./ServerCardPlayersSection/ServerCardPlayersSection";

const ServerCard = ({ server }) => {
  const isCod4 = server.game_type === "COD4";

  return (
    <div key={`${server.ip}-${server.port}`} className={s.serverCard}>
      <ServerCardHeader server={server} />
      <ServerCardMapSection server={server} isCod4={isCod4} />
      <ServerCardPlayersSection server={server} isCod4={isCod4} />
    </div>
  );
};

export default ServerCard;
