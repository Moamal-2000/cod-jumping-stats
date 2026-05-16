"use client";

import SortViewButtons from "@/components/Shared/Buttons/SortViewButtons/SortViewButtons";
import ExpandButton from "./ExpandButton/ExpandButton";
import ShowAllButton from "./ShowAllButton/ShowAllButton";
import s from "./SortView.module.scss";

const SortView = ({ setPaginationNumber }) => {
  return (
    <div className={s.sortViewWrapper}>
      <ShowAllButton setPaginationNumber={setPaginationNumber} />
      <ExpandButton controlsId="maps-section" />
      <SortViewButtons themeColor="blue" />
    </div>
  );
};

export default SortView;
