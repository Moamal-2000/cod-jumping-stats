"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import AdminLevel from "@/components/Shared/AdminLevel/AdminLevel";
import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { stripColorCodes } from "@/lib/utils";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useDispatch } from "react-redux";
import s from "./OnlinePlayerItem.module.scss";

const OnlinePlayerItem = ({ player, server }) => {
  const dispatch = useDispatch();

  const isCod4 = server.GameType === "COD4";
  const coloredName = getColoredName(player.Name || "Unknown Player");
  const pureName = stripColorCodes(player.Name);

  function handleClick(event) {
    if (isCod4) {
      event.preventDefault();
    }
  }

  function handleMouseEnter() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: pureName }));
  }

  return (
    <TransitionLink
      href={`/player/${player.PlayerID}`}
      className={`${s.playerItem} ${isCod4 ? s.cod4 : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <strong className={s.playerName}>
        <span className="visually-hidden">Player </span>
        {coloredName}
      </strong>

      <div className={s.playerInfo}>
        <AdminLevel adminLevel={player?.Admin} />

        <span className={s.playerPing}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#ping" />
          </svg>{" "}
          {player?.Ping || 0}ms
        </span>
      </div>
    </TransitionLink>
  );
};

export default OnlinePlayerItem;
