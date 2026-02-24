import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import { formateReleaseDate, getMapCompletionRate } from "@/functions/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo } from "react";
import CompletionRate from "../MapCard/CompletionRate/CompletionRate";
import { getHideMapInfo } from "../MapCard/MapCard";
import MapDifficulties from "../MapCard/MapDifficulties/MapDifficulties";
import s from "./MapCard2.module.scss";

const MapCard2 = ({ mapData, mapsScroll, allMaps, lastMapRef, index }) => {
  const {
    Author,
    Name,
    Classifications,
    Difficulty,
    IndividualFinishCount,
    Released,
    Videos,
    Ender,
    CpID,
  } = mapData;
  const ref = mapsScroll.length === index + 1 ? lastMapRef : null;
  const completionRate = getMapCompletionRate({
    allMaps,
    IndividualFinishCount,
  });

  const searchParams = useSearchParams();
  const {
    hideMapImage,
    hideDifficulties,
    hideCompletionRate,
    hideAuthorAndRelease,
  } = getHideMapInfo(searchParams);

  return (
    <div className={s.mapCard} ref={ref}>
      {!hideMapImage && (
        <Link href={`/map/${CpID}`} className={s.imgHolder}>
          <MapImage mapName={Name} />
        </Link>
      )}

      <div className={s.leftSide}>
        <Link href={`/map/${CpID}`}>
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

        {!hideDifficulties && <MapDifficulties Difficulty={Difficulty} />}

        <div className={s.classifications}>
          {Classifications?.map((text, index) => (
            <span className={`${s.classification} ${s[text]}`} key={index}>
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className={s.rightSide}>
        {!hideCompletionRate && (
          <CompletionRate completionRate={completionRate} />
        )}

        {!hideAuthorAndRelease && (
          <div className={s.authorAndRelease}>
            <span className={s.authorName}>{Author}</span>
            <span className={s.releaseDate}>
              {formateReleaseDate(Released)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MapCard2);
