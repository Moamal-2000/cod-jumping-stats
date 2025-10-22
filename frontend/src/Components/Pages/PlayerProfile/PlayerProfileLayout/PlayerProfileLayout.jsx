"use client";

import Breadcrumbs from "@/Components/Shared/Breadcrumbs/Breadcrumbs";
import { stripColorCodes } from "@/Functions/utils";
import {
  clearPlayerProfile,
  updatePlayerProfileState,
} from "@/Redux/slices/playerProfileSlice";
import {
  fetchPlayerJumpScores,
  fetchPlayerLeaderboardPositions,
  fetchPlayerProfile,
  fetchPlayerTops,
} from "@/Redux/thunks/playerProfileThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfileHeader from "./PlayerProfileHeader/PlayerProfileHeader";
import s from "./PlayerProfileLayout.module.scss";
import PlayerProfileTabs from "./playerProfileTabs/playerProfileTabs";

const PlayerProfileLayout = ({ children }) => {
  const jumpScores = useSelector((s) => s.playerProfile.jumpScores);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  useEffect(() => {
    if (!playerId) return;

    dispatch(clearPlayerProfile());

    dispatch(fetchPlayerProfile({ playerId }));
    dispatch(fetchPlayerLeaderboardPositions({ playerId }));
    dispatch(fetchPlayerTops({ playerId, fps: "125" }));
    dispatch(fetchPlayerJumpScores({ playerId, fps: "125" }));

    dispatch(
      updatePlayerProfileState({ key: "currentFetchingFps", value: "125" })
    );
  }, [dispatch, playerId]);

  return (
    <main className={s.playerPage}>
      <div className={s.playerProfile}>
        <Breadcrumbs
          breadcrumbLabels={breadcrumbLabels(
            stripColorCodes(jumpScores?.player_name)
          )}
          breadcrumbPaths={breadcrumbPaths}
        />

        <div className={s.profileContainer}>
          <PlayerProfileHeader />
          <PlayerProfileTabs />
          {children}
        </div>
      </div>
    </main>
  );
};

export default PlayerProfileLayout;

const breadcrumbLabels = (playerName) => ["Home", "Players", playerName];
const breadcrumbPaths = [
  { index: 0, path: "/" },
  { index: 1, path: `/players` },
];
