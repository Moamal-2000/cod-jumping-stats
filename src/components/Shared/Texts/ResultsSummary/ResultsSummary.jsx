import React from "react";
import s from "./ResultsSummary.module.scss";

const ResultsSummary = ({
  displayCount,
  total,
  label,
  as: Component = "p",
  className = "",
}) => {
  const isFragment = Component === React.Fragment;
  const classes = `${s.text} ${className}`;

  return (
    <Component {...(!isFragment && { className: classes })}>
      Showing <b>{displayCount}</b> of <b>{total}</b> {label}
    </Component>
  );
};

export default ResultsSummary;
