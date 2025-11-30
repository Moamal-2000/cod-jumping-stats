"use client";

import { useDispatch, useSelector } from "react-redux";
import s from "./TopRuns.module.scss";
import TopRunsContent from "./TopRunsContent/TopRunsContent";
import TopRunsOptions from "./TopRunsOptions/TopRunsOptions";

const TopRuns = () => {
  const { topRuns, topRunsLoading, jumpScoresLoading, currentFetchingFps } =
    useSelector((s) => s.playerProfile);
  const dispatch = useDispatch();

  const isLoading = topRunsLoading || jumpScoresLoading;

  return (
    <div className={s.topRunsTab}>
      <div className={s.topRunsHeader}>
        <TopRunsOptions />
      </div>

      {isLoading && (
        <div className={s.loadingContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading top runs...</p>
        </div>
      )}

      {!isLoading && <TopRunsContent />}
    </div>
  );
};

export default TopRuns;
