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

      const allPlayersData = await decodeAsyncData(response);
      const filteredPlayersData = getPlayersByParams({
        allPlayersData,
        paramsObject,
      });

      return { allPlayersData, filteredPlayersData };
    } catch (error) {
      console.error("Error in fetchAllPlayers:", error);
      throw error;
    }
  }
);
