import s from "./FavoritesGrid.module.scss";

/**
 * Responsive grid container for favorite items.
 * Provides consistent spacing and layout for both maps and players.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid items
 * @param {string} props.variant - Either 'maps' or 'players' for specific grid sizing
 */
const FavoritesGrid = ({ children, variant = "maps" }) => {
  return <div className={`${s.grid} ${s[variant]}`}>{children}</div>;
};

export default FavoritesGrid;
