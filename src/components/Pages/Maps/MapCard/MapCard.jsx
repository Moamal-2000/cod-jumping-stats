import AddToFavButton from "@/components/Shared/Buttons/AddToFavButton/AddToFavButton";
import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import { getMapCompletionRate } from "@/lib/filters";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

  const ref = mapsScroll?.length === index + 1 ? lastMapRef : null;
  const href = `/map/${CpID}${sourceParam === "jh" ? "" : `?source=${sourceParam}`}`;
  const mapDetailsLabel = `View ${Name}${Ender ? ` ${Ender} ` : " "}details`;

  const completionRate = getMapCompletionRate({
    allMaps,
    IndividualFinishCount,
  });

  const { hideMapImage, hideDifficulties, hideCompletionRate } =
    getHideMapInfo(searchParams);

  return (
    <div className={s.mapCard} ref={ref}>
      {!hideMapImage && (
        <Link
          href={href}
          className={s.imgHolder}
          aria-label={mapDetailsLabel}
          title={mapDetailsLabel}
        >
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
        </Link>
      )}

      <section className={s.content}>
        <div className={s.nameAndRating}>
          <Link href={href}>
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

          <AddToFavButton id={CpID} groupKey="mapsIds" />
        </div>

        {!hideDifficulties && (
          <MapDifficulties Difficulty={mapData?.Difficulty} />
        )}
        {!hideCompletionRate && (
          <CompletionRate completionRate={completionRate} />
        )}
        <AuthorAndRelease author={Author} release={Released} />
      </section>
    </div>
  );
};

export default memo(MapCard);

export function getHideMapInfo(searchParams) {
  const hideParams = searchParams.getAll("hide");
  const hideMapImage = hideParams.includes("map-image");
  const hideDifficulties = hideParams.includes("difficulties");
  const hideCompletionRate = hideParams.includes("completion-rate");

  return { hideMapImage, hideDifficulties, hideCompletionRate };
}
