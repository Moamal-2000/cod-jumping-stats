import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./features/global/slice/globalSlice";
import { jhStatsSlice } from "./features/jhStats/api/jhStatsSlice";
import leaderboardSlice from "./features/leaderboard/slice/leaderboardSlice";
import mapSlice from "./features/map/slice/mapSlice";
import mapsSlice from "./features/maps/slice/mapsSlice";
import playerProfileSlice from "./features/playerProfile/slice/playerProfileSlice";
import playersSlice from "./features/players/slice/playersSlice";
import { serversSlice } from "./features/servers/api/serversSlice";

export const store = configureStore({
  reducer: {
    [serversSlice.reducerPath]: serversSlice.reducer,
    [jhStatsSlice.reducerPath]: jhStatsSlice.reducer,
    global: globalSlice,
    leaderboard: leaderboardSlice,
    maps: mapsSlice,
    players: playersSlice,
    playerProfile: playerProfileSlice,
    map: mapSlice,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(
      serversSlice.middleware,
      jhStatsSlice.middleware,
    ),
});
