import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/functions/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPlayerProfile = createAsyncThunk(
  "playerProfile/fetchPlayerProfile",
  async ({ playerId }) => {
    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerId }).player.performanceStats,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerId}\` has insufficient data for performance stats, returning empty data`,
        );
        return { performanceStats: null };
      }

      const performanceStats = await decodeAsyncData(response);

      return { performanceStats };
    } catch (error) {
      console.error(`Error fetching player profile: ${error}`);
      return { performanceStats: null };
    }
  },
);

export const fetchPlayerLeaderboardPositions = createAsyncThunk(
  "playerProfile/fetchPlayerLeaderboardPositions",
  async ({ playerId }) => {
    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerId }).player.leaderboardPositions,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with Id \`${playerId}\` has insufficient data for leaderboard positions, returning empty data`,
        );
        return [];
      }

      const leaderboardPositions = await decodeAsyncData(response);

      return leaderboardPositions;
    } catch (error) {
      console.error(`Error fetching player leaderboard positions: ${error}`);
      return [];
    }
  },
);

export const fetchPlayerJumpScores = createAsyncThunk(
  "playerProfile/fetchPlayerJumpScores",
  async ({ playerId, fps = 125 }) => {
    try {
      fps === "mix" ? 0 : fps;
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerId, fps }).player.jumpScores,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerId}\` has insufficient data for jump scores (${fps} FPS), returning empty data`,
        );
        return null;
      }

      const jumpScores = await decodeAsyncData(response);

      return jumpScores;
    } catch (error) {
      console.error(`Error fetching player jump scores: ${error}`);
      return null;
    }
  },
);

export const fetchPlayerTops = createAsyncThunk(
  "playerProfile/fetchPlayerTops",
  async (paramsObject) => {
    const playerId = paramsObject.playerId;
    const fps = paramsObject.fps || "125";

    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerId, fps }).player.tops,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerId}\` has insufficient data for top runs, returning empty data`,
        );
        return {};
      }

      const topRuns = await decodeAsyncData(response);

      return topRuns;
    } catch (error) {
      console.error(`Error fetching player tops: ${error}`);
      return {};
    }
  },
);

export const fetchMapRuns = createAsyncThunk(
  "playerProfile/fetchPlayerRuns",
  async ({ playerId, cpid, fps }) => {
    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerId, cpid, fps }).player.mapRuns,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerId}\` has insufficient data for runs, returning empty data`,
        );
        return [];
      }

      const runs = await decodeAsyncData(response);

      return runs;
    } catch (error) {
      console.error(`Error fetching player runs: ${error}`);
      return {};
    }
  },
);
