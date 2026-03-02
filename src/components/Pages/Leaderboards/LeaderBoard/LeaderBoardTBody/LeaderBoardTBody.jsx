"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinnerLoader from "../../../../Shared/Loaders/SpinnerLoader/SpinnerLoader";
import LeaderBoardError from "./LeaderBoardError/LeaderBoardError";
import s from "./LeaderBoardTBody.module.scss";
import PlayerRow from "./PlayerRow/PlayerRow";

const LeaderBoardTBody = ({ leaderboardData, lastPlayerRef }) => {
  const { loading, error } = useSelector((s) => s.leaderboard);
  const isLeaderboardReversed = useSelector(
    (s) => s.global.isLeaderboardReversed,
  );

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const isRoutesCompleted =
    searchParams.get("leaderboard") === "routescompleted";

  const reverseClass = isLeaderboardReversed ? s.reverse : "";

  function handleMouseLeave() {
    dispatch(updateGlobalState({ key: "hoveredPlayer", value: null }));
  }

  return (
    <tbody
      className={`${s.tbody} ${reverseClass}`}
      onMouseLeave={handleMouseLeave}
    >
      {loading && !error && (
        <SpinnerLoader
          title="Loading leaderboard..."
          description="Fetching the latest leaderboard"
          type="table"
        />
      )}
      {error && <LeaderBoardError />}

      {!loading &&
        !error &&
        leaderboardData?.map((playerData, index) => {
          return (
            <Suspense key={playerData.PlayerID}>
              <PlayerRow
                playerData={playerData}
                leaderboardData={leaderboardData}
                lastPlayerRef={lastPlayerRef}
                isRoutesCompleted={isRoutesCompleted}
                index={index}
              />
            </Suspense>
          );
        })}
    </tbody>
  );
};

export default LeaderBoardTBody;
