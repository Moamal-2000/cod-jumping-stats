import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import { getMapCompletionRate } from "@/functions/utils";
import Link from "next/link";
import { memo } from "react";
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
  const ref = mapsScroll.length === index + 1 ? lastMapRef : null;
  const completionRate = getMapCompletionRate({
    allMaps,
    IndividualFinishCount,
  });

  function handleAddToFavoritesClick() {
    const favoritesLocal = localStorage.getItem("favorites");

    if (!favoritesLocal) {
      localStorage.setItem("favorites", JSON.stringify({ maps: [mapData] }));
      return "Added to favorites";
    }

    const favorites = JSON.parse(favoritesLocal);

    if (!favorites.maps) {
      favorites.maps = [mapData];
      localStorage.setItem("favorites", JSON.stringify(favorites));
      return "Added to favorites";
    }

    const isMapInFavorites = favorites.maps.some((map) => map.CpID === CpID);
    if (isMapInFavorites) return "Already in favorites";

    favorites.maps.push(mapData);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    return "Added to favorites";
  }

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

          <button type="button" onClick={handleAddToFavoritesClick}>
            Add to favorites
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
