"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch } from "react-redux";
import OnlinePlayerItem from "./OnlinePlayerItem/OnlinePlayerItem";
import s from "./OnlinePlayersList.module.scss";

const OnlinePlayersList = ({ server }) => {
  const dispatch = useDispatch();
  const players = [...server?.Players];
  const sortBAdminPlayers = players.sort((a, b) => b.Admin - a.Admin);

  const hasManyPlayers = players.length >= 10;
  const playersListClasses = `${s.playersList} ${hasManyPlayers ? s.scrollable : ""}`;

  function handleMouseLeave() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: null }));
  }

  return (
    <div className={playersListClasses} onMouseLeave={handleMouseLeave}>
      {sortBAdminPlayers.map((player, index) => (
        <OnlinePlayerItem key={index} player={player} server={server} />
      ))}
    </div>
  );
};

export default OnlinePlayersList;
