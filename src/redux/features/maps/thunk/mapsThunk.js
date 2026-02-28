import { jhApis } from "@/api/jumpersHeaven";
import { MAPS_CACHE_EXPIRATION_TIME } from "@/data/constants";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { cacheMapsLocally, getCachedMaps } from "@/lib/localCache";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMaps = createAsyncThunk(
  "globalSlice/fetchMaps",
  async (paramsObject) => {
    const cachedData = getCachedMaps();

    if (cachedData !== null) {
      const cacheAge = Date.now() - parseInt(cachedData.timeStamp, 10);
      const isCacheExpire = cacheAge > MAPS_CACHE_EXPIRATION_TIME;

      if (!isCacheExpire) {
        return { mapsData: cachedData.maps, paramsObject };
      }
    }

    try {
      const response = await fetchMsgPackResponse({
        url: jhApis().map.allMaps,
      });
      const mapsData = (await decodeAsyncData(response)) ?? [];
      cacheMapsLocally(mapsData);

      return { mapsData, paramsObject };
    } catch (error) {
      console.error(error);
    }
  },
);
