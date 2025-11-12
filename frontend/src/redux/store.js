import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./slices/globalSlice";
import leaderboardSlice from "./slices/leaderboardSlice";
import mapsSlice from "./slices/mapsSlice";
import playerProfileSlice from "./slices/playerProfileSlice";
import playersSlice from "./slices/playersSlice";
import searchSlice from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    search: searchSlice,
    leaderboard: leaderboardSlice,
    maps: mapsSlice,
    players: playersSlice,
    playerProfile: playerProfileSlice,
  },
});
