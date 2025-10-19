"use client";

import CountryImage from "@/Components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/Functions/components";
import { stripColorCodes } from "@/Functions/utils";
import { updateGlobalState } from "@/Redux/slices/globalSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import s from "./PlayerNameCell.module.scss";

const PlayerNameCell = ({ playerData }) => {
  const dispatch = useDispatch();
  const { PlayerName, Rank, CountryCode, Country, PlayerID } = playerData;
  const coloredPlayerName = getColoredName(PlayerName);
  const purePlayerName = stripColorCodes(PlayerName);
  const rankClass = s["rank" + Rank];

  function handleMouseEnter() {
    dispatch(
      updateGlobalState({ key: "hoveredPlayer", value: purePlayerName })
    );
  }

  return (
    <td className={`${s.player} ${rankClass}`}>
      <Link
        href={`/player?playerid=${PlayerID}`}
        onMouseEnter={handleMouseEnter}
      >
        <span className={s.playerCountry}>
          <CountryImage countryCode={CountryCode} countryName={Country} />
        </span>
        <span className={s.playerName}>{coloredPlayerName}</span>
      </Link>
    </td>
  );
};

export default PlayerNameCell;
