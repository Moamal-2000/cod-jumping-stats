"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import AdminLevel from "@/components/Shared/AdminLevel/AdminLevel";
import { stripColorCodes } from "@/lib/utils";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
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
        href={`/player/${PlayerID}`}
        className={s.playerName}
        onMouseEnter={handleMouseEnter}
      >
        {getColoredName(PlayerName)}
      </Link>

      <div className={s.wrapper}>
        <span className={s.playerId}>#{PlayerID}</span>
        <AdminLevel adminLevel={Admin} />
      </div>
    </div>
  );
};

export default PlayerPrimaryInfo;
