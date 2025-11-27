"use client";

import { updatePlayerProfileState } from "@/redux/features/playerProfile/slice/playerProfileSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./TopRuns.module.scss";
import TopRunsContent from "./TopRunsContent/TopRunsContent";
import TopRunsOptions from "./TopRunsOptions/TopRunsOptions";

const TopRuns = () => {
  const { topRuns, topRunsLoading, jumpScoresLoading, currentFetchingFps } =
    useSelector((s) => s.playerProfile);
  const dispatch = useDispatch();

  const [rankFilter, setRankFilter] = useState("1-10"); // "1", "1-10", "all"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [sortBy, setSortBy] = useState("score"); // "rank", "time", "date", "score"

  const [visibleTopRunsFps, setVisibleTopRunsFps] = useState({
    125: true,
    250: false,
    mix: false,
    333: false,
    76: false,
    43: false,
  });

  const [topRunsByFps, setTopRunsByFps] = useState({
    125: {},
    250: {},
    mix: {},
    333: {},
    76: {},
    43: {},
  });

  const isLoading = topRunsLoading || jumpScoresLoading;

  // Toggle top runs FPS visibility
  function toggleTopRunsFps(fps) {
    const newVisibleState = !visibleTopRunsFps[fps];

    setVisibleTopRunsFps((prev) => ({
      ...prev,
      [fps]: newVisibleState,
    }));

    // If enabling this FPS and we don't have data for it, fetch it
    if (
      newVisibleState &&
      (!topRunsByFps[fps] || Object.keys(topRunsByFps[fps]).length === 0)
    ) {
      dispatch(
        updatePlayerProfileState({ key: "currentFetchingFps", value: fps })
      );
    }
  }

  // Handle fetched top runs data and store by FPS
  useEffect(() => {
    if (topRuns && Object.keys(topRuns).length > 0 && currentFetchingFps) {
      setTopRunsByFps((prev) => ({
        ...prev,
        [currentFetchingFps]: topRuns,
      }));
    }
  }, [topRuns, currentFetchingFps]);

  return (
    <div className={s.topRunsTab}>
      <div className={s.topRunsHeader}>
        <TopRunsOptions
          visibleTopRunsFps={visibleTopRunsFps}
          toggleTopRunsFps={toggleTopRunsFps}
          rankFilter={rankFilter}
          setRankFilter={setRankFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>

      {isLoading && (
        <div className={s.loadingContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading top runs...</p>
        </div>
      )}

      {!isLoading && (
        <TopRunsContent
          visibleTopRunsFps={visibleTopRunsFps}
          topRunsByFps={topRunsByFps}
          rankFilter={rankFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default TopRuns;
