import { jhApis } from "@/Api/jumpersHeaven";
import { getPlayersByParams } from "@/Functions/filters";
import { decodeAsyncData, fetchMsgPackResponse } from "@/Functions/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllPlayers = createAsyncThunk(
  "playersSlice/fetchAllPlayers",
  async (paramsObject) => {
    try {
      const url = jhApis({ sort: paramsObject?.sort }).player.getAll;
      const response = await fetchMsgPackResponse({ url, cache: "no-cache" });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let playersData = await decodeAsyncData(response);
      playersData = getPlayersByParams({ playersData, paramsObject });

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
