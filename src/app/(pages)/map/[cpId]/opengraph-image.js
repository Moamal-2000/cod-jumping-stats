import { SITE_URL } from "@/data/metadata";
import { getMapByCpId } from "@/lib/api/mapsApi";
import { getCleanMapName } from "@/lib/utils";
import { ImageResponse } from "next/og";

/* eslint-disable @next/next/no-img-element */

export const size = { width: 1300, height: 740 };
export const contentType = "image/png";
export const revalidate = 86400; // 1 day
export const runtime = "edge";

export default async function Image({ params }) {
  const { cpId } = await params;
  const map = await getMapByCpId(cpId, "uint8Array");
  const cleanMapName = getCleanMapName(map.Name);
  const mapImagePath = `${SITE_URL}/assets/maps/1920/jpeg/${cleanMapName}.jpeg`;

  const MapOpenGraphElement = (
    <div style={s.container}>
      <p style={s.noImageText}>No Image Available for Map {map.Name}</p>

      <div style={s.mapContainer}>
        <img
          src={mapImagePath}
          width="100%"
          height="100%"
          style={s.mapImage}
          alt=""
        />
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
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #020617, #0f172a)",
  },

  noImageText: {
    fontSize: 60,
    fontWeight: 600,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    textWrap: "wrap",
    textAlign: "center",
    width: size.width - 100,
    padding: 20,
    right: 50,
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
    position: "absolute",
    top: 0,
    left: 0,
  },

  mapName: {
    fontSize: 60,
    fontWeight: 600,
    color: "white",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    bottom: 50,
    left: 50,
  },
};
