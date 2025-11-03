"use client";
import { graphData } from "@/Data/graphData";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { fetchMapRuns } from "@/Redux/thunks/playerProfileThunk";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./RunAnalytics.module.scss";
import Graph from "./components/Graph";
import MapList from "./components/MapList";

const RunAnalyticsPage = () => {
  const { mapRuns } = useSelector((s) => s.playerProfile);
  const [search, setSearch] = useState("");

  const allMaps = useSelector((s) => s.maps.allMaps);
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
      <h1 style={{ marginBottom: "0.5rem" }}>Run Analytics</h1>
      <div className={styles.container}>
        <MapList
          allMaps={allMaps}
          selectedCpid={selectedCpid}
          onSelect={setSelectedCpid}
          search={search}
          setSearch={setSearch}
        />

        <div className={styles.rightPanel}>
          <div className={styles.graphHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className={styles.graphTitle}>Player runs</div>
              <div style={{ color: "#9ca3af" }}>{runs?.length || 0} runs</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* <div
                className={styles.btnGroup}
                role="tablist"
                aria-label="fps selection"
              >
                {fpsOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFps(f)}
                    className={`${styles.chip} ${
                      selectedFps == f ? styles.chipActive : ""
                    }`}
                  >
                    {f} fps
                  </button>
                ))}
              </div> */}

              {/* <div
                className={styles.btnGroup}
                role="tablist"
                aria-label="route selection"
              >
                <button
                  className={`${styles.chip} ${
                    selectedRoute === "Route 1" ? styles.chipActive : ""
                  }`}
                  onClick={() => setSelectedRoute("Route 1")}
                >
                  Route 1
                </button>
                <button
                  className={`${styles.chip} ${
                    selectedRoute === "Route 2" ? styles.chipActive : ""
                  }`}
                  onClick={() => setSelectedRoute("Route 2")}
                >
                  Route 2
                </button>
              </div> */}
            </div>
          </div>

          <Graph data={runs} />
        </div>
      </div>
    </div>
  );
};

export default RunAnalyticsPage;
