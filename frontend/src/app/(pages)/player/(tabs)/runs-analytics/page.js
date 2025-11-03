"use client";
import { JUMP_FPS } from "@/Data/constants";
import { createQueryString } from "@/Functions/utils";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { fetchMapRuns } from "@/Redux/thunks/playerProfileThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./RunAnalytics.module.scss";
import Graph from "./components/Graph";
import MapList from "./components/MapList";

const RunAnalyticsPage = () => {
  const { mapRuns } = useSelector((s) => s.playerProfile);

  const { allMaps, loading } = useSelector((s) => s.maps);
  const dispatch = useDispatch();

  const [selectedCpid, setSelectedCpid] = useState(allMaps[0]?.CpID || null);

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const playerid = searchParams.get("playerid");
  const selectedFps = searchParams.get("fps") || 125;

  function handleFpsChange(event) {
    createQueryString(
      "fps",
      event.target.value,
      searchParams,
      router,
      pathname
    );
  }

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());

    dispatch(fetchMapRuns({ playerid, cpid: selectedCpid, fps: selectedFps }));
  }, [selectedCpid, selectedFps]);

  return (
    <div>
      <div className={s.container}>
        <MapList
          allMaps={allMaps}
          selectedCpid={selectedCpid}
          onSelect={setSelectedCpid}
          isLoading={loading}
        />
        <div className={s.rightPanel}>
          <div className={s.graphHeader}>
            <h2 className={s.graphTitle}>
              {mapRuns?.length >= 1 ? `${mapRuns?.length || 0} Runs` : ""}
            </h2>

            <div className={s.options}>
              <div className={s.optionGroup}>
                <label htmlFor="select-fps">FPS:</label>
                <select
                  value={selectedFps}
                  onChange={handleFpsChange}
                  id="select-fps"
                >
                  {JUMP_FPS.map((fps) => (
                    <option key={fps} value={fps}>
                      {fps}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <Graph data={mapRuns} />
        </div>
      </div>
    </div>
  );
};

export default RunAnalyticsPage;
