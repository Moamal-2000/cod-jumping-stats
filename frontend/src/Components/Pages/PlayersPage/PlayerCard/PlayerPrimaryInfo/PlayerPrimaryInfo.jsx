"use client";

import { getColoredName } from "@/Functions/components";
import { stripColorCodes } from "@/Functions/utils";
import { updateGlobalState } from "@/Redux/slices/globalSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import s from "./PlayerPrimaryInfo.module.scss";

const PlayerPrimaryInfo = ({ PlayerName, Admin, PlayerID }) => {
  const dispatch = useDispatch();
  const pureName = stripColorCodes(PlayerName);

  function handleMouseEnter() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: pureName }));
  }

  return (
    <div className={s.primaryInfo}>
      <Link
        href={`/player?playerid=${PlayerID}`}
        className={s.playerName}
        onMouseEnter={handleMouseEnter}
      >
        {getColoredName(PlayerName)}
      </Link>

      <div className={s.wrapper}>
        <span className={s.playerId}>#{PlayerID}</span>

        <div className={s.adminLevel}>
          <svg>
            <use href="/icons-sprite.svg#shield" />
          </svg>
          <span>{Admin}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerPrimaryInfo;
