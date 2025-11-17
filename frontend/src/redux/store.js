import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./features/global/slice/globalSlice";
import { jhStatsSlice } from "./features/jhStats/api/jhStatsSlice";
import leaderboardSlice from "./features/leaderboard/slice/leaderboardSlice";
import { serversSlice } from "./features/servers/api/serversSlice";
import mapsSlice from "./slices/mapsSlice";
import playerProfileSlice from "./slices/playerProfileSlice";
import playersSlice from "./slices/playersSlice";
import searchSlice from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    [serversSlice.reducerPath]: serversSlice.reducer,
    [jhStatsSlice.reducerPath]: jhStatsSlice.reducer,
    global: globalSlice,
    search: searchSlice,
    leaderboard: leaderboardSlice,
    maps: mapsSlice,
    players: playersSlice,
    playerProfile: playerProfileSlice,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(
      serversSlice.middleware,
      jhStatsSlice.middleware
    ),
});
