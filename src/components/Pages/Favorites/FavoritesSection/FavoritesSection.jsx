"use client";

import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapCard from "../../Maps/MapCard/MapCard";
import PlayerCard from "../../PlayersPage/PlayerCard/PlayerCard";
import s from "./FavoritesSection.module.scss";

const FavoritesSection = () => {
  const allMaps = useSelector((s) => s.maps.allMaps);
  const allPlayersData = useSelector((s) => s.players.allPlayersData);

  const [favMaps, setFavMaps] = useState([]);
  const [favPlayers, setFavPlayers] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());
    if (allPlayersData.length <= 0) dispatch(fetchAllPlayers());

    const favoritesLocal = localStorage.getItem("favorites");
    const favorites = JSON.parse(favoritesLocal);

    const filteredFavMaps = allMaps.filter((map) =>
      favorites.mapsIds.includes(map.CpID)
    );
    const filteredFavPlayers = allPlayersData.filter((player) => {
      return favorites.playersIds.includes(player.PlayerID);
    });

    setFavMaps(filteredFavMaps);
    setFavPlayers(filteredFavPlayers);
  }, [allMaps, allPlayersData]);

  return (
    <div className={s.favorites}>
      <div className="container" data-container>
        <section className={s.mapsSection}>
          {favMaps.length === 0 && (
            <p>
              You have no favorite <Link href="/maps">maps</Link>, add some.
            </p>
          )}

          {favMaps.map((map, index) => (
            <MapCard
              key={map.CpID}
              mapData={map}
              allMaps={allMaps}
              index={index}
            />
          ))}
        </section>

        <section className={s.playersSection}>
          {favPlayers.length === 0 && (
            <p>
              You have no favorite <Link href="/players">players</Link>, add
              some.
            </p>
          )}

          {favPlayers.map((player) => (
            <PlayerCard key={player.PlayerID} {...player} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default FavoritesSection;
