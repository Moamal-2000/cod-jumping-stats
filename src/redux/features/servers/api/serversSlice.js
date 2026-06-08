import { API_URL } from "@/api/jumpersHeaven";
import { baseQueryMsgPack } from "@/redux/msgPack/baseQueryMsgPack";
import { createApi } from "@reduxjs/toolkit/query/react";

export const serversSlice = createApi({
  reducerPath: "serversApi",
  baseQuery: async () => {
    const data = await baseQueryMsgPack({
      url: `${API_URL}/tracker/online-players`,
    });

    return { data };
  },
  endpoints: (builder) => ({
    getServers: builder.query({
      query: () => "tracker/online-players",
    }),
  }),
});

export const { useGetServersQuery } = serversSlice;
