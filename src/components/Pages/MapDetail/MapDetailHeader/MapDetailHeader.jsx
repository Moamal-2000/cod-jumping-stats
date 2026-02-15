import { jhApis } from "@/api/jumpersHeaven";
import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import MapRoutesSelector from "@/components/Shared/MapRoutesSelector/MapRoutesSelector";
import { JUMP_FPS } from "@/data/constants";
import { getColoredName } from "@/functions/components";
import { formateReleaseDate } from "@/functions/utils";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./MapDetailHeader.module.scss";

const MapDetailHeader = ({ mapData }) => {
  const { Name, Author, Released, Type, Ender, CpID } = mapData;
  const [bestPlayer, setBestPlayer] = useState(null);

  const allMaps = useSelector((state) => state.maps.allMaps);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allMaps.length <= 0) {
      dispatch(fetchMaps());
    }
  }, [allMaps.length, dispatch]);

  useEffect(() => {
    if (!CpID) {
      setBestPlayer(null);
      return;
    }

    let cancelled = false;
    setBestPlayer(null);

    async function fetchBestPlayer() {
      const results = await Promise.all(
        JUMP_FPS.map((fps) =>
          fetch(jhApis({ fps, cpid: CpID, limit: 50 }).map.tops)
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) {
                return data.map((run) => ({ ...run, fps }));
              }
              return [];
            })
            .catch(() => []),
        ),
      );

      if (cancelled) {
        return;
      }

      const allRuns = results
        .filter((result) => Array.isArray(result))
        .flat()
        .filter(
          (item) =>
            item &&
            typeof item === "object" &&
            item.time_played !== null &&
            item.time_played !== undefined,
        )
        .sort((a, b) => a.time_played - b.time_played);

      if (allRuns.length === 0) {
        setBestPlayer(null);
        return;
      }

      const bestPlayerRun = allRuns[0];

      setBestPlayer(
        bestPlayerRun
          ? {
              playerId: bestPlayerRun.player_id,
              playerName: bestPlayerRun.playername,
            }
          : null,
      );
    }

    fetchBestPlayer();

    return () => {
      cancelled = true;
    };
  }, [CpID]);

  return (
    <div className={s.header}>
      <div className={s.mapInfo}>
        <MapImage mapName={Name} resolution="1920" />

        <div className={s.mapDetails}>
          <h1 className={s.mapName}>
            {Name}
            {Ender && <span className={s.ender}>{Ender}</span>}
          </h1>

          <div className={s.mapMeta}>
            <div className={s.metaItem}>
              <span className={s.label}>Author:</span>
              <span className={s.value}>{Author}</span>
            </div>

            <div className={s.metaItem}>
              <span className={s.label}>Released:</span>
              <span className={s.value}>{formateReleaseDate(Released)}</span>
            </div>

            <div className={s.metaItem}>
              <span className={s.label}>Type:</span>
              <span className={`${s.value} ${s.typeBadge} ${s[Type]}`}>
                {Type}
              </span>
            </div>

            {bestPlayer?.playerName && (
              <div className={s.metaItem}>
                <span className={s.label}>Best player:</span>
                <span className={`${s.value} ${s.bestPlayerValue}`}>
                  <Link href={`/player?playerid=${bestPlayer.playerId}`}>
                    {getColoredName(bestPlayer.playerName)}
                  </Link>{" "}
                  is the best on this map
                </span>
              </div>
            )}
          </div>
        </div>

        <MapRoutesSelector allMaps={allMaps} Name={Name} Ender={Ender} />
      </div>
    </div>
  );
};

export default MapDetailHeader;
