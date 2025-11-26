"use client";

import Image from "next/image";
import { useState } from "react";
import SpinnerLoader from "../../Loaders/SpinnerLoader/SpinnerLoader";
import s from "./MapImage.module.scss";

const MapImage = ({ mapName, resolution = "512" }) => {
  const cleanMapName = getCleanMapName(mapName);

  const [src, setSrc] = useState(`/maps/${resolution}/${cleanMapName}.webp`);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);

  function handleError() {
    setSrc(PLACEHOLDER_PATH);
    setIsLoading(false);
    setScale(0.5);
  }

  return (
    <div className={s.imageContainer} data-type="img-holder">
      {isLoading && <SpinnerLoader />}

      <Image
        width={480}
        height={272}
        src={src || PLACEHOLDER_PATH}
        alt={mapName}
        title={mapName}
        style={{ scale, objectFit: "contain", objectPosition: "center" }}
        quality={100}
        priority
        onError={handleError}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default MapImage;

const PLACEHOLDER_PATH = "/placeholders/map-placeholder.svg";

function getCleanMapName(mapName) {
  if (!mapName) return "unknown";
  return mapName?.toLowerCase().replace(/[^a-z0-9_]/g, "");
}
