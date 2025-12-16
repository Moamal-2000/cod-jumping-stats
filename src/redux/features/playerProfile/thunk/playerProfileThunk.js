import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/functions/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPlayerProfile = createAsyncThunk(
  "playerProfile/fetchPlayerProfile",
  async ({ playerid }) => {
    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerid }).player.getPerformanceStats,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerid}\` has insufficient data for performance stats, returning empty data`
        );
        return { performanceStats: null };
      }

      const performanceStats = await decodeAsyncData(response);

      return { performanceStats };
    } catch (error) {
      console.error(`Error fetching player profile: ${error}`);
      return { performanceStats: null };
    }
  }
);

export const fetchPlayerLeaderboardPositions = createAsyncThunk(
  "playerProfile/fetchPlayerLeaderboardPositions",
  async ({ playerid }) => {
    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerid }).player.getLeaderboardPositions,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with Id \`${playerid}\` has insufficient data for leaderboard positions, returning empty data`
        );
        return [];
      }

      const leaderboardPositions = await decodeAsyncData(response);

      return leaderboardPositions;
    } catch (error) {
      console.error(`Error fetching player leaderboard positions: ${error}`);
      return [];
    }
  }
);

export const fetchPlayerJumpScores = createAsyncThunk(
  "playerProfile/fetchPlayerJumpScores",
  async ({ playerid, fps = 125 }) => {
    try {
      fps === "mix" ? 0 : fps;
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerid, fps }).player.getJumpScores,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerid}\` has insufficient data for jump scores (${fps} FPS), returning empty data`
        );
        return null;
      }

      const jumpScores = await decodeAsyncData(response);

      return jumpScores;
    } catch (error) {
      console.error(`Error fetching player jump scores: ${error}`);
      return null;
    }
  }
);

export const fetchPlayerTops = createAsyncThunk(
  "playerProfile/fetchPlayerTops",
  async (paramsObject) => {
    const playerid = paramsObject.playerid;
    const fps = paramsObject.fps || "125";

    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerid, fps }).player.getTops,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerid}\` has insufficient data for top runs, returning empty data`
        );
        return {};
      }

      const topRuns = await decodeAsyncData(response);

      return topRuns;
    } catch (error) {
      console.error(`Error fetching player tops: ${error}`);
      return {};
    }
  }
);

export const fetchMapRuns = createAsyncThunk(
  "playerProfile/fetchPlayerRuns",
  async ({ playerid, cpid, fps }) => {
    try {
      const response = await fetchMsgPackResponse({
        url: jhApis({ playerid, cpid, fps }).player.getMapRuns,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 500) {
        console.warn(
          `Player with ID \`${playerid}\` has insufficient data for runs, returning empty data`
        );
        return [];
      }

      const runs = await decodeAsyncData(response);

      return runs;
    } catch (error) {
      console.error(`Error fetching player runs: ${error}`);
      return {};
    }
  }
);
