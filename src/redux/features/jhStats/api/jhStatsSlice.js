import { API_URL } from "@/api/jumpersHeaven";
import { baseQueryMsgPack } from "@/redux/msgPack/baseQueryMsgPack";
import { createApi } from "@reduxjs/toolkit/query/react";

export const jhStatsSlice = createApi({
  reducerPath: "jhStatsApi",
  baseQuery: async () => {
    const mapsCountData = await baseQueryMsgPack({
      url: `${API_URL}/map/count`,
    });

    const data = { mapsCount: mapsCountData?.Count };
    return { data };
  },
  endpoints: ({ query }) => ({
    getJhStats: query({ query: () => "map/count" }),
  }),
});

export const { useGetJhStatsQuery } = jhStatsSlice;
