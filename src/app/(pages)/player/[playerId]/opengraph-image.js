import { getColoredNameForOG } from "@/components/Helper/playerNameColor";
import { SITE_URL } from "@/data/metadata";
import { getPlayerById } from "@/lib/api/playersApi";
import { ImageResponse } from "next/og";

export const size = { width: 1300, height: 740 };
export const contentType = "image/png";
export const revalidate = 21600; // 6 hours
export const runtime = "edge";

const logoSize = 400;
const countryWidth = 240;
const countryHeight = 140;

export default async function Image({ params }) {
  const { playerId } = await params;
  const player = await getPlayerById({ playerId, datatype: "uint8Array" });

  const playerCountryCode = player?.Country?.toLowerCase();
  const coloredPlayerName = getColoredNameForOG(
    player?.PrefName || player?.PlayerName,
  );

  const playerOpenGraphElement = (
    <div style={s.container}>
      <img
        src={`${SITE_URL}/assets/countryFlags/${playerCountryCode}.svg`}
        width={countryWidth}
        height={countryHeight}
        style={s.countryImg}
        alt=""
      />

      <img
        src={`${SITE_URL}/logo.svg`}
        width={logoSize}
        height={logoSize}
        style={s.logoImg}
        alt=""
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
    width: "1130px",
  },
};
