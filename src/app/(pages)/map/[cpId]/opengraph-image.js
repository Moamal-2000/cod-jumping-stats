import { getCleanMapName, getMapByCpId } from "@/functions/utils";
import { ImageResponse } from "next/og";

export const size = { width: 1300, height: 740 };
export const contentType = "image/png";
export const revalidate = 86400; // 1 day
export const runtime = "edge";

export default async function Image({ params }) {
  const { cpId } = await params;
  const map = await getMapByCpId(cpId, "uint8Array");
  const cleanMapName = getCleanMapName(map.Name);
  const mapImagePath = `${"http://localhost:3000"}/maps/1920/jpeg/${cleanMapName}.jpeg`;

  const MapOpenGraphElement = (
    <div style={s.container}>
      <div style={s.mapContainer}>
        <img src={mapImagePath} width="100%" height="100%" style={s.mapImage} />
        <span style={s.mapName}>By: {map.Author}</span>
      </div>
    </div>
  );

  return new ImageResponse(MapOpenGraphElement, { ...size });
}

const s = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #020617, #0f172a)",
  },

  mapContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
  },

  mapImage: {
    width: size.width,
    height: size.height,
    filter: "brightness(1.2)",
    objectFit: "cover",
  },

  mapName: {
    fontSize: 60,
    fontWeight: 600,
    color: "white",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    bottom: 50,
    left: 50,
  },
};
