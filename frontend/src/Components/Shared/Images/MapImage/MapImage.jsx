"use client";

import Image from "next/image";
import { memo, useState } from "react";
import s from "./MapImage.module.scss";

const PLACEHOLDER_PATH = "/placeholders/map-placeholder.svg";

const MapImage = memo(({ mapName, objectFit = "contain" }) => {
  // Clean the map name for file path
  const cleanMapName =
    mapName?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "unknown";
  const [src, setSrc] = useState(`/maps/512/${cleanMapName}.webp`);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  function handleError() {
    setHasError(true);
    setSrc(PLACEHOLDER_PATH);
    setIsLoading(false);
  }

  function handleLoadCompleted() {
    setIsLoading(false);
  }

  return (
    <div className={s.imageContainer}>
      {isLoading && (
        <div className={s.loader}>
          <svg>
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
        style={{
          objectFit,
          objectPosition: "center",
          scale: hasError ? 0.8 : 1,
        }}
        onError={handleError}
        onLoad={handleLoadCompleted}
        priority
      />
    </div>
  );
});

MapImage.displayName = "MapImage";

export default MapImage;
