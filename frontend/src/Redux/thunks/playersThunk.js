import { jhApis } from "@/Api/jumpersHeaven";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllPlayers = createAsyncThunk(
  "playersSlice/fetchAllPlayers",
  async (paramsObject) => {
    try {
      const url = jhApis({
        sort: paramsObject.sort || "admin_level",
      }).player.getAll;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const playersData = await response.json();

      return { playersData };
    } catch (error) {
      console.error("Error in fetchAllPlayers:", error);
      throw error;
    }
  }
);

export const searchPlayers = createAsyncThunk(
  "playersSlice/searchPlayers",
  async (paramsObject) => {
    try {
      const url = jhApis({
        sort: paramsObject.sort || "admin_level",
        limit: paramsObject.limit || 100,
      }).player.getAll;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allPlayers = await response.json();

      // Filter players by search term
      const searchTerm = paramsObject.searchTerm?.toLowerCase() || "";
      const filteredPlayers = allPlayers.filter(
        (player) =>
          player.pref_name?.toLowerCase().includes(searchTerm) ||
          player.playername?.toLowerCase().includes(searchTerm) ||
          player.force_name?.toLowerCase().includes(searchTerm)
      );

      return { playersData: filteredPlayers, paramsObject };
    } catch (error) {
      console.error("Error in searchPlayers:", error);
      throw error;
    }
  }
);
