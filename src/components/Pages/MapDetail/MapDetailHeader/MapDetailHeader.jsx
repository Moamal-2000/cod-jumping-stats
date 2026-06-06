import { jhApis } from "@/api/jumpersHeaven";
import { getColoredName } from "@/components/Helper/playerNameColor";
import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import MapRoutesSelector from "@/components/Shared/MapRoutesSelector/MapRoutesSelector";
import { JUMP_FPS } from "@/data/constants";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { formateReleaseDate } from "@/lib/dateTime";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { Link } from "next-view-transitions";
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

    if (!CpID || bestPlayer?.PlayerID) {
      return;
    }

    let cancelled = false;

    async function fetchBestPlayer() {
      if (cancelled) {
        return;
      }

      try {
        const results = await fetchAllTopRuns({ mapId: CpID });

        const allRuns = results
          .filter((result) => Array.isArray(result))
          .flat();

        const bestPlayerRun = allRuns?.sort(
          (a, b) => a.TimePlayed - b.TimePlayed,
        )?.[0];

        if (bestPlayerRun) {
          setBestPlayer(bestPlayerRun);
        }
      } catch (error) {
        console.error(`Error fetching best player :${error}`);
      }
    }

    fetchBestPlayer();

    return () => {
      cancelled = true;
    };
  }, [allMaps.length, CpID, dispatch]);

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

            {bestPlayer?.PlayerName && (
              <div className={s.metaItem}>
                <span className={s.label}>Best player:</span>
                <span className={`${s.value} ${s.bestPlayerValue}`}>
                  <Link href={`/player/${bestPlayer.PlayerID}`}>
                    {getColoredName(bestPlayer.PlayerName)}
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

export async function fetchAllTopRuns({ mapId }) {
  try {
    const topRunsPromises = JUMP_FPS.map(async (fps) => {
      const response = await fetchMsgPackResponse({
        url: jhApis({ fps, cpId: mapId }).map.tops,
      });
      const topRunsByFps = await decodeAsyncData(response);

      if (Array.isArray(topRunsByFps)) {
        return topRunsByFps.map((run) => ({ ...run, fps }));
      }

      return [];
    });

    return await Promise.all(topRunsPromises);
  } catch (error) {
    console.error(`Error fetching top runs: ${error}`);
    return [];
  }
}
