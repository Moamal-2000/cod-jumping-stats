"use client";

import { checkIsItemFavorited, toggleFavorite } from "@/functions/components";
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
