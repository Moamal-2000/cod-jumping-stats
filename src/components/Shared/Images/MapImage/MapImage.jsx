"use client";

import { getCleanMapName } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import SpinnerLoader from "../../Loaders/SpinnerLoader/SpinnerLoader";
import s from "./MapImage.module.scss";

const MapImage = ({
  mapName,
  resolution = "512",
  containerClassName = "",
  imageClassName = "",
  onError = () => {},
}) => {
  const cleanMapName = getCleanMapName(mapName);
  const imagePath = `/assets/maps/${resolution}/${cleanMapName}.webp`;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  function handleError() {
    setLoading(false);
    setError(true);
    onError();
  }

  return (
    <div
      className={`${s.imageContainer} ${containerClassName}`.trim()}
      data-type="img-holder"
    >
      {loading && <SpinnerLoader />}

      <Image
        width={480}
        height={272}
        className={`${imageClassName} ${s.image} ${error ? s.error : ""}`}
        src={imagePath}
        alt={mapName}
        quality={100}
        priority
        onError={handleError}
        onLoad={() => setLoading(false)}
      />

      {error && (
        <Image
          width={220}
          height={222}
          className={s.placeholder}
          src={PLACEHOLDER_PATH}
          alt={`${mapName} Placeholder`}
          quality={100}
          priority
        />
      )}
    </div>
  );
};

export default MapImage;

const PLACEHOLDER_PATH = "/assets/placeholders/map-placeholder.svg";
