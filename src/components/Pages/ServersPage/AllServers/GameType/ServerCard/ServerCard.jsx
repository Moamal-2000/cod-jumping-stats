"use client";

import s from "./ServerCard.module.scss";
import ServerCardHeader from "./ServerCardHeader/ServerCardHeader";
import ServerInfo from "./ServerCardMapSection/ServerInfo";
import ServerCardPlayersSection from "./ServerCardPlayersSection/ServerCardPlayersSection";

const ServerCard = ({ server, index, viewType }) => {
  return (
    <div className={`${s.serverCard} ${viewType === "list" ? s.list : ""}`}>
      <ServerCardHeader server={server} index={index} viewType={viewType} />
      <ServerInfo server={server} viewType={viewType} />
      <ServerCardPlayersSection server={server} />
    </div>
  );
};

export default ServerCard;
