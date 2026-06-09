import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./features/global/slice/globalSlice";
import { jhStatsSlice } from "./features/jhStats/api/jhStatsSlice";
import leaderboardSlice from "./features/leaderboard/slice/leaderboardSlice";
import mapSlice from "./features/map/slice/mapSlice";
import mapsSlice from "./features/maps/slice/mapsSlice";
import playerProfileSlice from "./features/playerProfile/slice/playerProfileSlice";
import playersSlice from "./features/players/slice/playersSlice";
import { serversSlice as serversApi } from "./features/servers/api/serversSlice";
import serversSlice from "./features/servers/slice/serversSlice";

export const store = configureStore({
  reducer: {
    [serversApi.reducerPath]: serversApi.reducer,
    [jhStatsSlice.reducerPath]: jhStatsSlice.reducer,
    global: globalSlice,
    leaderboard: leaderboardSlice,
    maps: mapsSlice,
    players: playersSlice,
    playerProfile: playerProfileSlice,
    map: mapSlice,
    servers: serversSlice,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(
      serversApi.middleware,
      jhStatsSlice.middleware,
    ),
});
