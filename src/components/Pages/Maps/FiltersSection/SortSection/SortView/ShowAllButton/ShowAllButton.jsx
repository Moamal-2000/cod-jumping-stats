"use client";

import { PAGINATION_ITEMS_PER_PAGE } from "@/data/constants";
import { updateMapsState } from "@/redux/features/maps/slice/mapsSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./ShowAllButton.module.scss";

const ShowAllButton = ({ setPaginationNumber }) => {
  const { mapsData, firstChunkMaps, allDataDisplayed, loading, error } =
    useSelector((s) => s.maps);
  const dispatch = useDispatch();

  const isMapsUnavailable = loading || error || mapsData?.length === 0;
  const flipButton =
    mapsData?.length === 0 ? false : allDataDisplayed ? true : false;
  const title = flipButton ? "Show less" : "Show all";

  function handleShowAllBtn() {
    if (allDataDisplayed) {
      handleShowLess();
      return;
    }

    handleShowAll();
  }

  function handleShowAll() {
    if (mapsData?.length <= 0 || allDataDisplayed) return;

    const lastMapsPagination = Math.ceil(
      mapsData?.length / PAGINATION_ITEMS_PER_PAGE,
    );

    dispatch(updateMapsState({ key: "mapsScroll", value: mapsData }));
    setPaginationNumber(lastMapsPagination);
  }

  function handleShowLess() {
    if (mapsData?.length <= 0) return;

    dispatch(updateMapsState({ key: "mapsScroll", value: firstChunkMaps }));
    setPaginationNumber(1);
  }

  return (
    <button
      type="button"
      className={`${s.showAllBtn} ${flipButton ? s.active : ""}`}
      onClick={handleShowAllBtn}
      disabled={isMapsUnavailable}
      aria-label={title}
      title={title}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#angles-down" />
      </svg>
    </button>
  );
};

export default ShowAllButton;
