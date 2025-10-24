"use client";

import Image from "next/image";
import { memo, useState } from "react";
import s from "./MapImage.module.scss";

const PLACEHOLDER_PATH = "/placeholders/map-placeholder.svg";

const MapImage = memo(({ mapName }) => {
  const cleanMapName =
    mapName?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "unknown";
  const [src, setSrc] = useState(`/maps/512/${cleanMapName}.webp`);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);

  function handleError() {
    setSrc(PLACEHOLDER_PATH);
    setIsLoading(false);
    setScale(0.5);
  }

  function handleLoadCompleted() {
    setIsLoading(false);
  }

  return (
    <div className={s.imageContainer}>
      {isLoading && (
        <div className={s.loader}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#animated-spinner" />
          </svg>
        </div>
      )}

      <Image
        sizes="402.9px"
        fill={true}
        src={src || PLACEHOLDER_PATH}
        alt={mapName}
        title={mapName}
        style={{ scale, objectFit: "contain", objectPosition: "center" }}
        onError={handleError}
        onLoad={handleLoadCompleted}
        priority
      />
    </div>
  );
});

MapImage.displayName = "MapImage";

export default MapImage;
