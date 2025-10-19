"use client";

import { getColoredName } from "@/Functions/components";
import { stripColorCodes } from "@/Functions/utils";
import { updateGlobalState } from "@/Redux/slices/globalSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import s from "./PlayerPrimaryInfo.module.scss";

const PlayerPrimaryInfo = ({ name, adminLevel, id }) => {
  const dispatch = useDispatch();
  const pureName = stripColorCodes(name);

  function handleMouseEnter() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: pureName }));
  }

  return (
    <div className={s.primaryInfo}>
      <Link
        href={`/player?playerid=${id}`}
        className={s.playerName}
        onMouseEnter={handleMouseEnter}
      >
        {getColoredName(name)}
      </Link>

      <div className={s.wrapper}>
        <span className={s.playerId}>#{id}</span>

        <div className={s.adminLevel}>
          <svg>
            <use href="/icons-sprite.svg#shield" />
          </svg>
          <span>{adminLevel}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerPrimaryInfo;
