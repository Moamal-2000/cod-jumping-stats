import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import { getMapCompletionRate } from "@/functions/utils";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import AuthorAndRelease from "./AuthorAndRelease/AuthorAndRelease";
import CompletionRate from "./CompletionRate/CompletionRate";
import s from "./MapCard.module.scss";
import MapDifficulties from "./MapDifficulties/MapDifficulties";

const MapCard = ({ mapData, mapsScroll, allMaps, lastMapRef, index }) => {
  const {
    Author,
    IndividualFinishCount,
    Name,
    Classifications,
    Released,
    Videos,
    CpID,
    Ender,
  } = mapData;
  const [isFavorited, setIsFavorited] = useState(false);

  const ref = mapsScroll?.length === index + 1 ? lastMapRef : null;
  const completionRate = getMapCompletionRate({
    allMaps,
    IndividualFinishCount,
  });

  useEffect(() => {
    checkIfMapIsFavorited({ setIsFavorited, CpID });
  }, [CpID]);

  return (
    <div className={s.mapCard} ref={ref}>
      <div className={s.imgHolder}>
        <MapImage mapName={Name} />

        <div className={s.layer}>
          <div className={s.classifications}>
            {Classifications?.map((text, index) => (
              <span className={`${s.classification} ${s[text]}`} key={index}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className={s.content}>
        <div className={s.nameAndRating}>
          <Link href={`/map?mapid=${CpID}`}>
            <span className={s.name}>
              {Name}
              {Ender && <span className={s.ender}>({Ender})</span>}
            </span>
            {Videos?.length > 0 && (
              <span className={s.videoIcon}>
                <svg aria-hidden="true">
                  <use href="/icons-sprite.svg#youtube" />
                </svg>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => toggleFavorite({ setIsFavorited, CpID })}
            className={`${s.favoriteButton} ${isFavorited ? s.favorited : ""}`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg viewBox="0 0 24 24">
              <use
                href={`/icons-sprite.svg#${isFavorited ? "trashCan" : "heart"}`}
              ></use>
            </svg>
          </button>
        </div>

        <MapDifficulties Difficulty={mapData?.Difficulty} />
        <CompletionRate completionRate={completionRate} />
        <AuthorAndRelease author={Author} release={Released} />
      </section>
    </div>
  );
};

export default memo(MapCard);

function checkIfMapIsFavorited({ setIsFavorited, CpID }) {
  const favoritesLocal = localStorage.getItem("favorites");

  if (!favoritesLocal) return;

  const favorites = JSON.parse(favoritesLocal);
  const isMapInFavorites = favorites.mapsIds?.includes(CpID);

  setIsFavorited(isMapInFavorites);
}

function toggleFavorite({ setIsFavorited, CpID }) {
  const favoritesLocal = localStorage.getItem("favorites");
  let favorites = favoritesLocal ? JSON.parse(favoritesLocal) : { mapsIds: [] };

  const isMapInFavorites = favorites.mapsIds?.includes(CpID);

  if (isMapInFavorites) {
    favorites.mapsIds = favorites.mapsIds.filter((mapId) => mapId !== CpID);
    setIsFavorited(false);
  } else {
    favorites.mapsIds.push(CpID);
    setIsFavorited(true);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}
