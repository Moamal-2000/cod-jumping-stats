"use client";

import Breadcrumbs from "@/components/Shared/Breadcrumbs/Breadcrumbs";
import { stripColorCodes } from "@/functions/utils";
import {
  clearPlayerProfile,
  updatePlayerProfileState,
} from "@/redux/features/playerProfile/slice/playerProfileSlice";
import {
  fetchPlayerJumpScores,
  fetchPlayerLeaderboardPositions,
  fetchPlayerProfile,
} from "@/redux/features/playerProfile/thunk/playerProfileThunk";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfileHeader from "./PlayerProfileHeader/PlayerProfileHeader";
import s from "./PlayerProfileLayout.module.scss";
import PlayerProfileTabs from "./playerProfileTabs/playerProfileTabs";

const PlayerProfileLayout = ({ children, playerId }) => {
  const allPlayersData = useSelector((s) => s.players.allPlayersData);
  const jumpScores = useSelector((s) => s.playerProfile.jumpScores);
  const dispatch = useDispatch();

  const playerData = allPlayersData.find(
    (player) => player.PlayerID === playerId,
  );

  const purePlayerName = stripColorCodes(
    playerData?.PrefName || playerData?.PlayerName || jumpScores?.PlayerName,
  );

  useEffect(() => {
    if (!playerId) return;

    dispatch(clearPlayerProfile());

    dispatch(fetchPlayerProfile({ playerId }));
    dispatch(fetchPlayerLeaderboardPositions({ playerId }));
    dispatch(fetchPlayerJumpScores({ playerId, fps: "125" }));
    dispatch(fetchAllPlayers());

    dispatch(
      updatePlayerProfileState({ key: "currentFetchingFps", value: "125" }),
    );
  }, [dispatch, playerId]);

  return (
    <div className="container">
      <main className={s.playerPage}>
        <Breadcrumbs
          breadcrumbLabels={breadcrumbLabels(purePlayerName)}
          breadcrumbPaths={breadcrumbPaths}
        />

        <div className={s.profileContainer}>
          <PlayerProfileHeader playerData={playerData} playerId={playerId} />
          <PlayerProfileTabs playerId={playerId} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlayerProfileLayout;

const breadcrumbLabels = (playerName) => ["Home", "Players", playerName];
const breadcrumbPaths = [
  { index: 0, path: "/" },
  { index: 1, path: `/players` },
];
