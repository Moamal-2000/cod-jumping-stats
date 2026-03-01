"use client";

import { getCleanMapName } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import SpinnerLoader from "../../Loaders/SpinnerLoader/SpinnerLoader";
import s from "./MapImage.module.scss";

const MapImage = ({ mapName, resolution = "512" }) => {
  const cleanMapName = getCleanMapName(mapName);

  const [src, setSrc] = useState(`/assets/maps/${resolution}/${cleanMapName}.webp`);
  const [isLoading, setIsLoading] = useState(true);

  const scale = src === PLACEHOLDER_PATH ? 0.5 : 1;
  const objectFit = src === PLACEHOLDER_PATH ? "contain" : "cover";

  function handleError() {
    setSrc(PLACEHOLDER_PATH);
    setIsLoading(false);
  }

  return (
    <div className={s.imageContainer} data-type="img-holder">
      {isLoading && <SpinnerLoader />}

      <Image
        width={480}
        height={272}
        src={src || PLACEHOLDER_PATH}
        alt={mapName}
        style={{ scale, objectFit }}
        quality={100}
        priority
        onError={handleError}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default MapImage;

const PLACEHOLDER_PATH = "/assets/placeholders/map-placeholder.svg";
