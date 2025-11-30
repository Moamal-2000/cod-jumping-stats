import { Suspense } from "react";
import s from "./FilterCard.module.scss";

const FilterCard = ({ title, children }) => {
  return (
    <Suspense>
      <div className={s.card} aria-labelledby={`filter-card-title-${title}`}>
        <h2 id={`filter-card-title-${title}`}>{title}</h2>
        {children}
      </div>
    </Suspense>
  );
};

export default FilterCard;
