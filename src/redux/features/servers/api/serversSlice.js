import { API_URL } from "@/api/jumpersHeaven";
import { baseQueryMsgPack } from "@/redux/msgPack/baseQueryMsgPack";
import { createApi } from "@reduxjs/toolkit/query/react";

export const serversSlice = createApi({
  reducerPath: "serversApi",
  baseQuery: async (endpoint) => {
    const [j4lResponse, jhResponse] = await Promise.allSettled([
      baseQueryMsgPack({ url: `${API_URL}/${endpoint}?source=j4l` }),
      baseQueryMsgPack({ url: `${API_URL}/${endpoint}` }),
    ]);

    const isError = !!(j4lResponse?.value?.error && jhResponse?.value?.error);
    const j4lServers = isError ? [] : j4lResponse.value.Servers;
    const jhServers = isError ? [] : jhResponse.value.Servers;

    if (isError) {
      return {
        error: {
          status: "FETCH_ERROR",
          error: "Failed to fetch both j4l and jh servers data",
        },
      };
    }

    return { data: { Servers: [...j4lServers, ...jhServers] } };
  },

  endpoints: (builder) => ({
    getServers: builder.query({
      query: () => "tracker/online-players",
    }),
  }),
});

export const { useGetServersQuery } = serversSlice;
