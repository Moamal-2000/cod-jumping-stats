"use client";

import { fetchPlayerTops } from "@/redux/features/playerProfile/thunk/playerProfileThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./TopRuns.module.scss";
import TopRunsContent from "./TopRunsContent/TopRunsContent";
import TopRunsOptions from "./TopRunsOptions/TopRunsOptions";

const TopRuns = ({ playerId }) => {
  const { topRunsLoading, jumpScoresLoading } = useSelector(
    (s) => s.playerProfile,
  );

  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const paramsObject = {
    ...Object.fromEntries(searchParams.entries()),
    playerId,
  };
  const selectedFps = searchParams.get("fps") || 125;

  const isLoading = topRunsLoading || jumpScoresLoading;

  useEffect(() => {
    dispatch(fetchPlayerTops(paramsObject));
  }, [selectedFps, playerId]);

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
