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
import { fetchAllPlayers } from "@/Redux/thunks/playersThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfileHeader from "./PlayerProfileHeader/PlayerProfileHeader";
import s from "./PlayerProfileLayout.module.scss";
import PlayerProfileTabs from "./playerProfileTabs/playerProfileTabs";

const PlayerProfileLayout = ({ children }) => {
  const allPlayersData = useSelector((s) => s.players.allPlayersData);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const playerid = +searchParams.get("playerid");

  const playerData = allPlayersData.find(
    (player) => player.PlayerID === playerid
  );

  const purePlayerName = stripColorCodes(
    playerData?.PrefName || playerData?.PlayerName
  );

  useEffect(() => {
    if (!playerid) return;

    dispatch(clearPlayerProfile());

    dispatch(fetchPlayerProfile({ playerid }));
    dispatch(fetchPlayerLeaderboardPositions({ playerid }));
    dispatch(fetchPlayerTops({ playerid, fps: "125" }));
    dispatch(fetchPlayerJumpScores({ playerid, fps: "125" }));
    dispatch(fetchAllPlayers());

    dispatch(
      updatePlayerProfileState({ key: "currentFetchingFps", value: "125" })
    );
  }, [dispatch, playerid]);

  return (
    <main className={s.playerPage}>
      <div className={s.playerProfile}>
        <Breadcrumbs
          breadcrumbLabels={breadcrumbLabels(purePlayerName)}
          breadcrumbPaths={breadcrumbPaths}
        />

        <div className={s.profileContainer}>
          <PlayerProfileHeader playerData={playerData} />
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
