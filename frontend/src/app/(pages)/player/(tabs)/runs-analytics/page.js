"use client";
import { graphData } from "@/Data/graphData";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./RunAnalytics.module.scss";
import Graph from "./components/Graph";
import MapList from "./components/MapList";

const RunAnalyticsPage = () => {
  // prepare maps list (unique by cpid)
  const [search, setSearch] = useState("");

  const allMaps = useSelector((s) => s.maps.allMaps);
  const dispatch = useDispatch();

  const [selectedCpid, setSelectedCpid] = useState(allMaps[0]?.CpID || null);
  // fps selection and route selection (static for now)
  const fpsOptions = useMemo(
    () => Array.from(new Set(graphData.map((d) => d.fps))),
    []
  );
  const [selectedFps, setSelectedFps] = useState(fpsOptions[0] || "125");
  const [selectedRoute, setSelectedRoute] = useState("Route 1");

  // filter runs for the selected map + fps
  const runsForSelected = useMemo(() => {
    if (!selectedCpid) return [];
    return graphData.filter(
      (r) => r.cpid === selectedCpid && String(r.fps) === String(selectedFps)
    );
  }, [selectedCpid, selectedFps]);

  useEffect(() => {
    dispatch(fetchMaps());
  }, []);

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
              <div style={{ color: "#9ca3af" }}>
                {runsForSelected.length} runs
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
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
              </div>

              <div
                className={styles.btnGroup}
                role="tablist"
                aria-label="route selection"
              >
                {/* static route for demo; future: derive from data */}
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
              </div>
            </div>
          </div>

          <Graph data={runsForSelected} />
        </div>
      </div>
    </div>
  );
};

export default RunAnalyticsPage;
