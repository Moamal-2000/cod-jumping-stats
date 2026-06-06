"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import { stripColorCodes } from "@/lib/utils";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { Link } from "next-view-transitions";
import { useDispatch } from "react-redux";
import s from "./PlayerNameCell.module.scss";

const PlayerNameCell = ({ playerData, index }) => {
  const { PlayerName, Rank, CountryCode, Country, PlayerID } = playerData;

  const dispatch = useDispatch();

  const coloredPlayerName = getColoredName(PlayerName);
  const purePlayerName = stripColorCodes(PlayerName);

  const classes = `${s.player} ${s["rank" + Rank]}`;

  function handleMouseEnter() {
    dispatch(
      updateGlobalState({ key: "hoveredPlayer", value: purePlayerName }),
    );
  }

  return (
    <td className={classes}>
      <Link
        href={`/player/${PlayerID}`}
        title={`View ${purePlayerName}'s profile`}
        onMouseEnter={handleMouseEnter}
      >
        <span className={s.playerCountry}>
          <CountryImage
            countryCode={CountryCode}
            countryName={Country}
            loadEagerly={index < 5}
          />
        </span>
        <span className={s.playerName}>{coloredPlayerName}</span>
      </Link>
    </td>
  );
};

export default PlayerNameCell;
