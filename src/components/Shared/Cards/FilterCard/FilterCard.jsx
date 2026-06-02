import { Suspense } from "react";
import s from "./FilterCard.module.scss";

const FilterCard = ({ title, children }) => {
  return (
    <Suspense>
      <fieldset
        className={s.card}
        aria-labelledby={`filter-card-title-${title}`}
      >
        <legend id={`filter-card-title-${title}`}>{title}</legend>
        {children}
      </fieldset>
    </Suspense>
  );
};

export default FilterCard;
