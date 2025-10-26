import { API_URL, jhApis } from "@/Api/jumpersHeaven";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPlayerProfile = createAsyncThunk(
  "playerProfile/fetchPlayerProfile",
  async ({ playerid }) => {
    try {
      const response = await fetch(
        jhApis({ playerid }).player.getPerformanceStats
      );
      if (!response.ok) {
        if (response.status === 500) {
          console.warn(
            `Player ${playerid} has insufficient data for performance stats, returning empty data`
          );
          return {
            performanceStats: null,
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const performanceStats = await response.json();

      return {
        performanceStats,
      };
    } catch (error) {
      console.error("Error fetching player profile:", error);
      return {
        performanceStats: null,
      };
    }
  }
);

export const fetchPlayerLeaderboardPositions = createAsyncThunk(
  "playerProfile/fetchPlayerLeaderboardPositions",
  async ({ playerid }) => {
    try {
      const response = await fetch(
        jhApis({ playerid }).player.getLeaderboardPositions
      );

      if (!response.ok) {
        if (response.status === 500) {
          console.warn(
            `Player ${playerid} has insufficient data for leaderboard positions, returning empty data`
          );
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const leaderboardPositions = await response.json();

      return leaderboardPositions;
    } catch (error) {
      console.error("Error fetching player leaderboard positions:", error);
      return [];
    }
  }
);

export const fetchPlayerJumpScores = createAsyncThunk(
  "playerProfile/fetchPlayerJumpScores",
  async ({ playerid, fps = 125 }) => {
    try {
      fps === "mix" ? 0 : fps;
      const response = await fetch(
        `${API_URL}/player/jump-scores?fps=${fps}&playerid=${playerid}`
      );
      if (!response.ok) {
        if (response.status === 500) {
          console.warn(
            `Player ${playerid} has insufficient data for jump scores (${fps} FPS), returning empty data`
          );
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jumpScores = await response.json();

      return jumpScores;
    } catch (error) {
      console.error("Error fetching player jump scores:", error);
      return null;
    }
  }
);

export const fetchPlayerTops = createAsyncThunk(
  "playerProfile/fetchPlayerTops",
  async ({ playerid, fps = 125, limit = 200 }) => {
    try {
      fps === "mix" ? 0 : fps;
      const response = await fetch(
        jhApis({ playerid, fps, limit }).player.getTops
      );
      if (!response.ok) {
        if (response.status === 500) {
          console.warn(
            `Player ${playerid} has insufficient data for top runs (${fps} FPS), returning empty data`
          );
          return {};
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const topRuns = await response.json();

      return topRuns;
    } catch (error) {
      console.error("Error fetching player tops:", error);
      return {};
    }
  }
);
