"use client";

import { getColoredName } from "@/Functions/components";
import { stripColorCodes } from "@/Functions/utils";
import { updateGlobalState } from "@/Redux/slices/globalSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import s from "./OnlinePlayerItem.module.scss";

const OnlinePlayerItem = ({ player, server }) => {
  const dispatch = useDispatch();

  const isCod4 = server.GameType === "COD4";
  const coloredName = getColoredName(player.Name || "Unknown Player");
  const pureName = stripColorCodes(player.Name);

  function handleClick(event) {
    if (isCod4) event.preventDefault();
  }

  function handleMouseEnter() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: pureName }));
  }

  return (
    <Link
      href={`/player?playerid=${player.PlayerID}`}
      className={`${s.playerItem} ${isCod4 ? s.cod4 : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <strong className={s.playerName}>
        <span className="visually-hidden">Player </span>
        {coloredName}
      </strong>

      <div className={s.playerInfo}>
        <span className={s.playerAdminLevel}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#shield" />
          </svg>{" "}
          {player?.Admin || "N/A"}
          <span className="visually-hidden">Admin Level</span>
        </span>

        <span className={s.playerPing}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#ping" />
          </svg>{" "}
          {player?.Ping || 0}ms
        </span>
      </div>
    </Link>
  );
};

export default OnlinePlayerItem;
