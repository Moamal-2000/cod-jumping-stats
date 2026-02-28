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
    <svg
      style={{ stroke: medalType === "bronze" ? "#d97706" : "#9ca3af" }}
      data-type={medalType}
    >
      <use href="/icons-sprite.svg#medal"></use>
    </svg>
  );
}
