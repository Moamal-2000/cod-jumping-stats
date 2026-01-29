import { jhApis } from "@/api/jumpersHeaven";
import { getPlayersByParams } from "@/functions/filters";
import { decodeAsyncData, fetchMsgPackResponse } from "@/functions/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllPlayers = createAsyncThunk(
  "playersSlice/fetchAllPlayers",
  async (paramsObject) => {
    try {
      const url = jhApis({ sort: paramsObject?.sort }).player.all;
      const response = await fetchMsgPackResponse({ url });

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
  },
);
