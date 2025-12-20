"use client";

import SpinnerLoader from "@/components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
import { createQueryString, removeQueryString } from "@/functions/utils";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapCard from "../../Maps/MapCard/MapCard";
import PlayerCard from "../../PlayersPage/PlayerCard/PlayerCard";
import EmptyState from "./EmptyState/EmptyState";
import FavoritesGrid from "./FavoritesGrid/FavoritesGrid";
import s from "./FavoritesSection.module.scss";
import HeroSection from "./HeroSection/HeroSection";
import TabPanel from "./TabPanel/TabPanel";
import Tabs from "./Tabs/Tabs";

const FavoritesSection = () => {
  const { allMaps, loading: mapsLoading } = useSelector((s) => s.maps);
  const { allPlayersData, loading: playersLoading } = useSelector(
    (s) => s.players
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
    <main className={s.favorites}>
      <div className="container" data-container>
        <HeroSection />

        <Tabs
          tabs={tabs({ mapsCount, playersCount })}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          ariaLabel="Favorites navigation"
        />

        <TabPanel id="maps" isActive={activeTab === "maps"}>
          {mapsLoading && (
            <SpinnerLoader
              title="Loading Maps"
              description="Fetching your favorite maps..."
            />
          )}
          {!mapsLoading && favMaps.length === 0 && <EmptyState type="maps" />}

          {!mapsLoading && favMaps.length > 0 && (
            <FavoritesGrid variant="maps">
              {favMaps.map((map, index) => (
                <MapCard
                  key={map.CpID}
                  mapData={map}
                  allMaps={allMaps}
                  index={index}
                />
              ))}
            </FavoritesGrid>
          )}
        </TabPanel>

        <TabPanel id="players" isActive={activeTab === "players"}>
          {playersLoading && (
            <SpinnerLoader
              title="Loading Players"
              description="Fetching your favorite players..."
            />
          )}

          {!playersLoading && favPlayers.length === 0 && (
            <EmptyState type="players" />
          )}

          {!playersLoading && favPlayers.length > 0 && (
            <FavoritesGrid variant="players">
              {favPlayers.map((player) => (
                <PlayerCard key={player.PlayerID} {...player} />
              ))}
            </FavoritesGrid>
          )}
        </TabPanel>
      </div>
    </main>
  );
};

export default FavoritesSection;

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

  const favoritesLocal = localStorage.getItem("favorites");
  const favorites = JSON.parse(favoritesLocal);

  const filteredFavMaps = allMaps.filter((map) =>
    favorites.mapsIds.includes(map.CpID)
  );
  const filteredFavPlayers = allPlayersData.filter((player) =>
    favorites.playersIds.includes(player.PlayerID)
  );

  setFavMaps(filteredFavMaps);
  setFavPlayers(filteredFavPlayers);
}
