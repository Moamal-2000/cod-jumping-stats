"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import AdminLevel from "@/components/Shared/AdminLevel/AdminLevel";
import { stripColorCodes } from "@/lib/utils";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { Link } from "next-view-transitions";
import { useDispatch } from "react-redux";
import ToolTip from "../../ToolTip";
import s from "./PlayerPrimaryInfo.module.scss";

const PlayerPrimaryInfo = ({ PlayerName, PrefName, Admin, PlayerID }) => {
  const dispatch = useDispatch();

  const pureName = stripColorCodes(PlayerName);
  const coloredPrefName = getColoredName(PrefName || PlayerName);

  function handleMouseEnter() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: pureName }));
  }

  function handleCopyPlayerId(PlayerID) {
    navigator.clipboard.writeText(PlayerID);
    dispatch(updateGlobalState({ key: "activeCopyAlert", value: true }));
  }

  return (
    <div className={s.primaryInfo}>
      <Link
        href={`/player/${PlayerID}`}
        className={s.playerNameWrapper}
        onMouseEnter={handleMouseEnter}
      >
        <span className={s.playerName}>{getColoredName(PlayerName)}</span>
        <ToolTip centerPosition>{coloredPrefName}</ToolTip>
      </Link>

      <div className={s.wrapper}>
        <button
          type="button"
          className={s.playerId}
          onClick={() => handleCopyPlayerId(PlayerID)}
        >
          #{PlayerID}
          <ToolTip centerPosition>Copy</ToolTip>
        </button>

        <AdminLevel adminLevel={Admin} />
      </div>
    </div>
  );
};

export default PlayerPrimaryInfo;
