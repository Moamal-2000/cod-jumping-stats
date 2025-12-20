import s from "./FavoritesGrid.module.scss";

const FavoritesGrid = ({ children, variant = "maps" }) => {
  return <div className={`${s.grid} ${s[variant]}`}>{children}</div>;
};

export default FavoritesGrid;
