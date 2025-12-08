import { COD2_COLORS } from "@/data/staticData";

export function getModifiedRank(rank) {
  const isTop1 = rank === 1;
  const isTop3 = rank <= 3;
  const isBelowTop3 = !(isTop1 || isTop3);

  if (isBelowTop3) return `#${rank}`;

  const medalType = rank === 2 ? "silver" : "bronze";

  return isTop1 ? (
    <svg data-type="trophy">
      <use href="/icons-sprite.svg#trophy"></use>
    </svg>
  ) : (
    <svg style={{ stroke: medalType === "bronze" ? "#d97706" : "#9ca3af" }}>
      <use href="/icons-sprite.svg#medal"></use>
    </svg>
  );
}

export function getColoredName(name = "Unknown Player") {
  const colorParts = name.split(/\^(?=\d)/);
  const colorNumbers = colorParts.slice(1).map((part) => part.charAt(0));

  return colorParts.map((part, index) => {
    if (index === 0 || !colorNumbers[index - 1]) return part;

    const colorNumber = colorNumbers[index - 1];
    const text = part.slice(1);
    const color = COD2_COLORS[colorNumber];

    return (
      <span className={color} key={index}>
        {text}
      </span>
    );
  });
}

export function toggleFavorite({
  setIsFavorited,
  id,
  groupKey = "playersIds",
} = {}) {
  const favoritesLocal = localStorage.getItem("favorites");
  let favorites = favoritesLocal
    ? JSON.parse(favoritesLocal)
    : { mapsIds: [], playersIds: [] };

  const isPlayerInFavorites = favorites[groupKey]?.includes(id);

  if (isPlayerInFavorites) {
    favorites[groupKey] = favorites[groupKey].filter((itemId) => itemId !== id);
    setIsFavorited(false);
  } else {
    favorites[groupKey].push(id);
    setIsFavorited(true);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function checkIsItemFavorited({
  setIsFavorited,
  id,
  groupKey = "playersIds",
}) {
  const favoritesLocal = localStorage.getItem("favorites");

  if (!favoritesLocal) return;

  const favorites = JSON.parse(favoritesLocal);
  const isFavorited = favorites[groupKey]?.includes(id);

  setIsFavorited(isFavorited);
}
