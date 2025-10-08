import { COD2_COLORS } from "@/Data/staticData";

export function getModifiedRank(rank) {
  const isTop1 = rank === 1;
  const isTop3 = rank <= 3;
  const isBelowTop3 = !(isTop1 || isTop3);

  if (isBelowTop3) return `#${rank}`;

  const medalType = rank === 2 ? "silver" : "bronze";

  return isTop1 ? (
    <svg data-type="trophy">
      <use href="/badgesIcons.svg#trophy"></use>
    </svg>
  ) : (
    <svg style={{ stroke: medalType === "bronze" ? "#d97706" : "#9ca3af" }}>
      <use href="/badgesIcons.svg#medal"></use>
    </svg>
  );
}

export function getColoredName(name) {
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
