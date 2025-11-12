"use client";

import s from "./ServerCard.module.scss";
import ServerCardHeader from "./ServerCardHeader/ServerCardHeader";
import ServerCardMapSection from "./ServerCardMapSection/ServerCardMapSection";
import ServerCardPlayersSection from "./ServerCardPlayersSection/ServerCardPlayersSection";

const ServerCard = ({ server, index }) => {
  return (
    <div className={s.serverCard}>
      <ServerCardHeader server={server} index={index} />
      <ServerCardMapSection server={server} />
      <ServerCardPlayersSection server={server} />
    </div>
  );
};

export default ServerCard;
