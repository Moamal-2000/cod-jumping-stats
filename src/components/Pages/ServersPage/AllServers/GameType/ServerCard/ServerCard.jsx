"use client";

import s from "./ServerCard.module.scss";
import ServerCardHeader from "./ServerCardHeader/ServerCardHeader";
import ServerInfo from "./ServerCardMapSection/ServerInfo";
import ServerCardPlayersSection from "./ServerCardPlayersSection/ServerCardPlayersSection";

const ServerCard = ({ server, index, viewMode }) => {
  return (
    <div className={`${s.serverCard} ${viewMode === "list" ? s.list : ""}`}>
      <ServerCardHeader server={server} index={index} />
      <ServerInfo server={server} />
      <ServerCardPlayersSection server={server} />
    </div>
  );
};

export default ServerCard;
