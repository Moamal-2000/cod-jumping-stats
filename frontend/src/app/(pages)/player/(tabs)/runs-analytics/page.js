"use client";
import { graphData } from "@/Data/graphData";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { fetchMapRuns } from "@/Redux/thunks/playerProfileThunk";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./RunAnalytics.module.scss";
import Graph from "./components/Graph";
import MapList from "./components/MapList";

const RunAnalyticsPage = () => {
  const { mapRuns } = useSelector((s) => s.playerProfile);

  const { allMaps, loading } = useSelector((s) => (s.maps));
  const dispatch = useDispatch();

  const [selectedCpid, setSelectedCpid] = useState(allMaps[0]?.CpID || null);
  const fpsOptions = Array.from(new Set(graphData.map((d) => d.fps)));

  const [selectedFps, setSelectedFps] = useState(fpsOptions[0] || "125");
  const [selectedRoute, setSelectedRoute] = useState("Route 1");

  const searchParams = useSearchParams();
  const playerid = searchParams.get("playerid");

  // filter runs for the selected map + fps
  function runsForSelected() {
    if (!selectedCpid && mapRuns?.length > 0) return [];

    return mapRuns?.filter(
      (run) =>
        run.CpID === selectedCpid && String(run.FPS) === String(selectedFps)
    );
  }

  const runs = runsForSelected();

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());

    dispatch(fetchMapRuns({ playerid, cpid: selectedCpid, fps: 125 }));
  }, [selectedCpid]);

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
            <div className={s.graphTitle}>Player runs</div>
            <div className={s.runCount}>{runs?.length || 0} runs</div>
          </div>
          <Graph data={runs} />
        </div>
      </div>
    </div>
  );
};

export default RunAnalyticsPage;
