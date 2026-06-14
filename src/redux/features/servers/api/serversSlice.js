import { API_URL } from "@/api/jumpersHeaven";
import { baseQueryMsgPack } from "@/redux/msgPack/baseQueryMsgPack";
import { createApi } from "@reduxjs/toolkit/query/react";

export const serversSlice = createApi({
  reducerPath: "serversApi",
  baseQuery: async (endpoint) => {
    try {
      const [j4lServers, jhServers] = await Promise.allSettled([
        baseQueryMsgPack({ url: `${API_URL}/${endpoint}?source=j4l` }),
        baseQueryMsgPack({ url: `${API_URL}/${endpoint}` }),
      ]);

      const data = {
        Servers: [...j4lServers.value.Servers, ...jhServers.value.Servers],
      };

      return { data };
    } catch (error) {
      console.error(`Failed to fetch servers data: `, error);
      return { data: {} };
    }
  },

  endpoints: (builder) => ({
    getServers: builder.query({
      query: () => "tracker/online-players",
    }),
  }),
});

export const { useGetServersQuery } = serversSlice;
