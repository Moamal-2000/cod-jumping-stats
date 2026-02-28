"use client";

import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroSection from "./HeroSection/HeroSection";
import FavMaps from "./TabPanel/FavMaps/FavMaps";
import FavPlayers from "./TabPanel/FavPlayers/FavPlayers";
import TabPanel from "./TabPanel/TabPanel";
import Tabs from "./Tabs/Tabs";

const Favorites = () => {
  const { allMaps, loading: mapsLoading } = useSelector((s) => s.maps);
  const { allPlayersData, loading: playersLoading } = useSelector(
    (s) => s.players,
  );

  const [favMaps, setFavMaps] = useState([]);
  const [favPlayers, setFavPlayers] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const activeTab = searchParams.get("tab") || "maps";
  const mapsCount = favMaps.length;
  const playersCount = favPlayers.length;

  function handleTabChange(tabId) {
    createQueryString("tab", tabId, searchParams, router, pathname);

    if (tabId === "maps")
      removeQueryString("tab", searchParams, router, pathname);
  }

  useEffect(() => {
    loadFavorites({
      allMaps,
      allPlayersData,
      setFavMaps,
      setFavPlayers,
      dispatch,
    });
  }, [allMaps, allPlayersData]);

  return (
    <div className="container">
      <main>
        <HeroSection />

        <Tabs
          tabs={tabs({ mapsCount, playersCount })}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          ariaLabel="Favorites navigation"
        />

        <TabPanel id="maps" isActive={activeTab === "maps"}>
          <FavMaps
            favMaps={favMaps}
            allMaps={allMaps}
            mapsLoading={mapsLoading}
          />
        </TabPanel>

        <TabPanel id="players" isActive={activeTab === "players"}>
          <FavPlayers favPlayers={favPlayers} playersLoading={playersLoading} />
        </TabPanel>
      </main>
    </div>
  );
};

export default Favorites;

const tabs = ({ mapsCount, playersCount }) => [
  { id: "maps", label: "Maps", icon: "map", count: mapsCount },
  { id: "players", label: "Players", icon: "users", count: playersCount },
];

function loadFavorites({
  allMaps = [],
  allPlayersData = [],
  setFavMaps,
  setFavPlayers,
  dispatch,
} = {}) {
  if (allMaps.length <= 0) dispatch(fetchMaps());
  if (allPlayersData.length <= 0) dispatch(fetchAllPlayers());

  const favoritesLocal = localStorage.getItem("favorites") || "[]";
  const favorites = JSON.parse(favoritesLocal);

  if (favorites <= 0) return;

  const filteredFavMaps = allMaps.filter((map) =>
    favorites.mapsIds.includes(map.CpID),
  );
  const filteredFavPlayers = allPlayersData.filter((player) =>
    favorites.playersIds.includes(player.PlayerID),
  );

  setFavMaps(filteredFavMaps);
  setFavPlayers(filteredFavPlayers);
}
