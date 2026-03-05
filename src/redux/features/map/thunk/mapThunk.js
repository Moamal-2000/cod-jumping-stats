import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMapTops = createAsyncThunk(
  "globalSlice/fetchMapTops",
  async (paramsObject) => {
    try {
      const { fps, cpId } = paramsObject;

      const response = await fetchMsgPackResponse({
        url: jhApis({ fps, cpId }).map.tops,
      });
      const mapTops = (await decodeAsyncData(response)) ?? [];

      return mapTops;
    } catch (error) {
      console.error(error);
    }
  },
);
