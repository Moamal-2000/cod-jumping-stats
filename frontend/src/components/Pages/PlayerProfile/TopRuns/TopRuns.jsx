"use client";

import { useState } from "react";
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

  const isLoading = topRunsLoading || jumpScoresLoading;

  return (
    <div className={s.topRunsTab}>
      <div className={s.topRunsHeader}>
        <TopRunsOptions
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
          rankFilter={rankFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default TopRuns;
