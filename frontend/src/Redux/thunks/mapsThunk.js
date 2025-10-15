import { jhApis } from "@/Api/jumpersHeaven";
import { cacheMapsLocally, decodeAsyncData } from "@/Functions/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMaps = createAsyncThunk(
  "globalSlice/fetchMaps",
  async (paramsObject) => {
    try {
      const response = await fetch(jhApis().map.getAllMaps, {
        headers: { Accept: "application/msgpack", "Accept-Encoding": "gzip" },
      });
      const mapsData = await decodeAsyncData(response);
      cacheMapsLocally(mapsData);

      return { mapsData, paramsObject };
    } catch (error) {
      console.error(error);
    }
  }
);
