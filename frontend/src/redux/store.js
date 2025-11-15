import { configureStore } from "@reduxjs/toolkit";
import { jhStatsSlice } from "./features/jhStats/api/jhStatsSlice";
import { serversSlice } from "./features/servers/api/serversSlice";
import globalSlice from "./slices/globalSlice";
import leaderboardSlice from "./slices/leaderboardSlice";
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
