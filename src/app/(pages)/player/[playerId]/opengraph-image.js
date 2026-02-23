import { SITE_URL } from "@/data/metadata";
import { getColoredNameForOG } from "@/functions/components";
import { getPlayerById } from "@/functions/utils";
import { ImageResponse } from "next/og";

export const size = { width: 1300, height: 740 };
export const contentType = "image/png";
export const revalidate = 60;

const logoSize = 400;

export default async function Image({ params }) {
  const { playerId } = await params;
  const player = await getPlayerById({ playerId });
  const coloredPlayerName = getColoredNameForOG(
    player?.PrefName || player?.PlayerName,
  );

  const playerOpenGraphElement = (
    <div style={s.container}>
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
    margin: "0 auto",
    width: logoSize,
    height: logoSize,
    filter: "brightness(1.5) saturate(1.5)",
    marginBottom: -50,
  },

  playerName: {
    fontSize: 90,
    fontWeight: 700,
    marginRight: 40,
    color: "#fff",
    display: "flex",
    alignSelf: "center",
    width: size.width - 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
