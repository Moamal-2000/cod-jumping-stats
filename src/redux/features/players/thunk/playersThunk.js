import { jhApis } from "@/api/jumpersHeaven";
import { PLAYER_CACHE_EXPIRATION_TIME } from "@/data/constants";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { cachePlayersLocally, getCachedPlayers } from "@/lib/localCache";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllPlayers = createAsyncThunk(
  "playersSlice/fetchAllPlayers",
  async (paramsObject) => {
    const dataType = paramsObject?.sort || "last-seen";
    const cachedData = getCachedPlayers(dataType);

    if (cachedData !== null && dataType === cachedData.dataType) {
      const cacheAge = Date.now() - parseInt(cachedData.timeStamp);
      const isCacheExpire = cacheAge > PLAYER_CACHE_EXPIRATION_TIME;

      if (!isCacheExpire) {
        return { allPlayersData: cachedData.allPlayersData, paramsObject };
      }
    }

    try {
      const url = jhApis({ sort: paramsObject?.sort }).player.all;
      const response = await fetchMsgPackResponse({ url });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allPlayersData = (await decodeAsyncData(response)) ?? [];
      if (allPlayersData.length > 0)
        cachePlayersLocally(allPlayersData, dataType);

      return { allPlayersData, paramsObject };
    } catch (error) {
      console.error("Error in fetchAllPlayers:", error);
      throw error;
    }
  },
);
