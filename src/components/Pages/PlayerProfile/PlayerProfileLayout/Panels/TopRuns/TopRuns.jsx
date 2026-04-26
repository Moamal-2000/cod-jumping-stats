"use client";

import { normalizeFpsQuery } from "@/components/Footer/formatting";
import { fetchPlayerTops } from "@/redux/features/playerProfile/thunk/playerProfileThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import s from "./TopRuns.module.scss";
import TopRunsContent from "./TopRunsContent/TopRunsContent";
import TopRunsOptions from "./TopRunsOptions/TopRunsOptions";

const TopRuns = ({ playerId }) => {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const paramsObject = {
    ...Object.fromEntries(searchParams.entries()),
    playerId,
  };
  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));

  useEffect(() => {
    dispatch(fetchPlayerTops(paramsObject));
  }, [selectedFps, playerId]);

  return (
    <div className={s.topRunsTab}>
      <div className={s.topRunsHeader}>
        <TopRunsOptions />
      </div>

      <TopRunsContent />
    </div>
  );
};

export default TopRuns;
