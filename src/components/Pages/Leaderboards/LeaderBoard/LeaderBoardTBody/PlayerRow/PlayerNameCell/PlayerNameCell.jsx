"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { stripColorCodes } from "@/lib/utils";
import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import s from "./PlayerNameCell.module.scss";

const PlayerNameCell = ({ playerData, index }) => {
  const { PlayerName, Rank, CountryCode, Country, PlayerID } = playerData;

  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

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
      <TransitionLink
        href={`/player/${PlayerID}${sourceParam === "jh" ? "" : `?source=${sourceParam}`}`}
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
      </TransitionLink>
    </td>
  );
};

export default PlayerNameCell;
