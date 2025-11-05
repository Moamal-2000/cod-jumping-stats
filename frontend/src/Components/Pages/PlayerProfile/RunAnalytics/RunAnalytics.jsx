"use client";

import SelectMenu from "@/Components/Shared/SelectMenus/SelectMenu/SelectMenu";
import { createQueryString } from "@/Functions/utils";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { fetchMapRuns } from "@/Redux/thunks/playerProfileThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Graph from "./Graph";
import MapList from "./MapList";
import MapRoutes from "./MapRoutes/MapRoutes";
import s from "./RunAnalytics.module.scss";

const fpsOptions = [
  { label: "43 FPS", value: "43", id: 1 },
  { label: "76 FPS", value: "76", id: 2 },
  { label: "125 FPS", value: "125", id: 3 },
  { label: "250 FPS", value: "250", id: 4 },
  { label: "333 FPS", value: "333", id: 5 },
];

const RunAnalytics = () => {
  const { mapRuns, mapRunsLoading } = useSelector((s) => s.playerProfile);
  const { allMaps, loading } = useSelector((s) => s.maps);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const playerid = searchParams.get("playerid");
  const selectedFps = searchParams.get("fps") || 125;
  const selectedMapId = parseInt(searchParams.get("mapid"));

  function handleFpsChange(event) {
    createQueryString(
      "fps",
      event.target.value,
      searchParams,
      router,
      pathname
    );
  }

  function selectMapRoute(mapId) {
    createQueryString("mapid", mapId, searchParams, router, pathname);
  }

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());

    dispatch(fetchMapRuns({ playerid, cpid: selectedMapId, fps: selectedFps }));
  }, [selectedMapId, selectedFps]);

  return (
    <div>
      <div className={s.container}>
        <MapList
          allMaps={allMaps}
          selectedMapId={selectedMapId}
          selectMapRoute={selectMapRoute}
          isLoading={loading}
        />

        <div className={s.rightPanel}>
          <div className={s.graphHeader}>
            <h2 className={s.graphTitle}>
              {mapRuns?.length >= 1 ? `${mapRuns?.length || 0} Runs` : ""}
            </h2>

            <div className={s.options}>
              <MapRoutes
                allMaps={allMaps}
                selectedMapId={selectedMapId}
                selectMapRoute={selectMapRoute}
              />
              <SelectMenu
                label="FPS"
                onChange={handleFpsChange}
                optionsData={fpsOptions}
              />
            </div>
          </div>
          <Graph data={mapRuns} isLoading={mapRunsLoading} />
        </div>
      </div>
    </div>
  );
};

export default RunAnalytics;
