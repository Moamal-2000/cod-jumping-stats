"use client";

import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapCard from "../../Maps/MapCard/MapCard";
import s from "./FavoritesSection.module.scss";

const FavoritesSection = () => {
  const { allMaps } = useSelector((s) => s.maps);
  const [favMaps, setFavMaps] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());

    const favoritesLocal = localStorage.getItem("favorites");
    const favorites = JSON.parse(favoritesLocal);

    const filteredFavMaps = allMaps.filter((map) =>
      favorites.mapsIds.includes(map.CpID)
    );

    setFavMaps(filteredFavMaps);
  }, [allMaps]);

  return (
    <div className="container">
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
    </div>
  );
};

export default FavoritesSection;
