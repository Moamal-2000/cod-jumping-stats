import { SITE_URL } from "@/data/metadata";
import { getColoredNameForOG } from "@/functions/components";
import { getCountryName, getPlayerById } from "@/functions/utils";
import { ImageResponse } from "next/og";

export const size = { width: 1300, height: 740 };
export const contentType = "image/png";
export const revalidate = 60;

const logoSize = 400;
const countryWidth = 240;
const countryHeight = 140;

export default async function Image({ params }) {
  const { playerId } = await params;
  const player = await getPlayerById({ playerId });

  const playerCountryCode = player?.Country?.toLowerCase();
  const coloredPlayerName = getColoredNameForOG(
    player?.PrefName || player?.PlayerName,
  );

  const playerOpenGraphElement = (
    <div style={s.container}>
      <img
        src={`${SITE_URL}/countryFlags/${playerCountryCode}.svg`}
        alt={`${getCountryName(playerCountryCode)} flag`}
        width={countryWidth}
        height={countryHeight}
        style={s.countryImg}
      />

      <img
        src={`${SITE_URL}/logo.png`}
        alt="Jumpers Heaven Logo"
        width={logoSize}
        height={logoSize}
        style={s.logoImg}
      />

      <div style={s.playerName}>{coloredPlayerName}</div>
    </div>
  );

  return new ImageResponse(playerOpenGraphElement, { ...size });
}

const s = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 70,
    paddingTop: 100,
    background: "linear-gradient(135deg, #020617, #0f172a)",
  },

  logoImg: {
    width: logoSize,
    height: logoSize,
    filter: "brightness(1.5) saturate(1.5)",
    margin: "0 auto",
    marginBottom: -50,
  },

  countryImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: countryWidth,
    height: countryHeight,
    filter: "brightness(1.5) saturate(1.5)",
  },

  playerName: {
    fontSize: 90,
    fontWeight: 700,
    color: "#fff",
    display: "flex",
    alignSelf: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
