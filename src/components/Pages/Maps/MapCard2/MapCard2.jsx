import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { formateReleaseDate } from "@/lib/dateTime";
import { getMapCompletionRate } from "@/lib/filters";
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

  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

  const ref = mapsScroll.length === index + 1 ? lastMapRef : null;
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
        <TransitionLink
          href={href}
          className={s.imgHolder}
          ari-label={mapDetailsLabel}
          title={mapDetailsLabel}
        >
          <MapImage mapName={Name} />
        </TransitionLink>
      )}

      <div className={s.leftSide}>
        <TransitionLink href={href}>
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
        </TransitionLink>

        {!hideDifficulties && (
          <MapDifficulties Difficulty={Difficulty} hideLabel />
        )}

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

        <div className={s.authorAndRelease}>
          <span className={s.authorName}>{Author}</span>
          <span className={s.releaseDate}>{formateReleaseDate(Released)}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(MapCard2);
