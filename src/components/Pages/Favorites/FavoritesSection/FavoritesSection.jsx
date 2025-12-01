"use client";

import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapCard from "../../Maps/MapCard/MapCard";
import s from "./FavoritesSection.module.scss";

const FavoritesSection = () => {
  const favoritesLocal = localStorage.getItem("favorites");

  const dispatch = useDispatch();
  const { allMaps } = useSelector((s) => s.maps);

  if (!favoritesLocal) return null;

  const favorites = JSON.parse(favoritesLocal);
  const favMaps = allMaps.filter((map) => favorites.mapsIds.includes(map.CpID));

  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());
  }, []);

  return (
    <div className="container">
      <section className={s.mapsSection}>
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
