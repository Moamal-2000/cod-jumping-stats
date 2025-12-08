"use client";

import { useEffect, useState } from "react";
import s from "./AddToFavButton.module.scss";

const AddToFavButton = ({ id, groupKey }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    checkIsItemFavorited({ setIsFavorited, id, groupKey });
  }, [id]);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite({ setIsFavorited, id, groupKey })}
      className={`${s.favoriteButton} ${isFavorited ? s.favorited : ""}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg viewBox="0 0 24 24">
        <use
          href={`/icons-sprite.svg#${isFavorited ? "trashCan" : "heart"}`}
        ></use>
      </svg>
    </button>
  );
};

export default AddToFavButton;

function toggleFavorite({ setIsFavorited, id, groupKey = "playersIds" } = {}) {
  const favoritesLocal = localStorage.getItem("favorites");
  let favorites = favoritesLocal
    ? JSON.parse(favoritesLocal)
    : { mapsIds: [], playersIds: [] };

  const isPlayerInFavorites = favorites[groupKey]?.includes(id);

  if (isPlayerInFavorites) {
    favorites[groupKey] = favorites[groupKey].filter((itemId) => itemId !== id);
    setIsFavorited(false);
  } else {
    if (!favorites[groupKey]) favorites[groupKey] = [];

    favorites[groupKey].push(id);
    setIsFavorited(true);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function checkIsItemFavorited({ setIsFavorited, id, groupKey = "playersIds" }) {
  const favoritesLocal = localStorage.getItem("favorites");

  if (!favoritesLocal) return;

  const favorites = JSON.parse(favoritesLocal);
  const isFavorited = favorites[groupKey]?.includes(id);

  setIsFavorited(isFavorited);
}
