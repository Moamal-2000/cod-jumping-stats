import { jhApis } from "@/Api/jumpersHeaven";
import { MAPS_CACHE_EXPIRATION_TIME } from "@/Data/constants";
import {
  cacheMapsLocally,
  decodeAsyncData,
  fetchMsgPackResponse,
} from "@/Functions/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMaps = createAsyncThunk(
  "globalSlice/fetchMaps",
  async (paramsObject) => {
    let mapsLocal = localStorage.getItem("mapsData");

    if (mapsLocal) {
      const cachedData = JSON.parse(mapsLocal);
      const isCacheExpire =
        Date.now() - cachedData.timeStamp > MAPS_CACHE_EXPIRATION_TIME;

      if (!isCacheExpire) {
        return { mapsData: cachedData.maps, paramsObject };
      }
    }

    try {
      const response = await fetchMsgPackResponse({
        url: jhApis().map.getAllMaps,
        cache: "no-cache",
      });
      const mapsData = await decodeAsyncData(response);

      cacheMapsLocally(mapsData);
      return { mapsData, paramsObject };
    } catch (error) {
      console.error(error);
    }
  }
);
