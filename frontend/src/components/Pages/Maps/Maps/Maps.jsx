"use client";

import { getIsLastPagination, paginateData } from "@/functions/utils";
import { updateMapsState } from "@/redux/slices/mapsSlice";
import { fetchMaps } from "@/redux/thunks/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinnerLoader from "../../../Shared/Loaders/SpinnerLoader/SpinnerLoader";
import s from "./Maps.module.scss";
import ViewMaps from "./ViewMaps/ViewMaps";

const Maps = ({ paginationNumber, setPaginationNumber, lastMapRef }) => {
  const { mapsScroll, allDataDisplayed, loading, error, mapsData } =
    useSelector((s) => s.maps);
  const { pageVisits, isMapsExpanded } = useSelector((s) => s.global);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || "grid";
  const paramsObject = Object.fromEntries(searchParams.entries());

  const collapseClass = isMapsExpanded ? "" : s.collapse;
  const listClass = viewType === "list" ? s.list : "";

  function addDataOnScroll() {
    const paginationMapsData = paginateData(mapsData, paginationNumber);
    const value = mapsScroll.concat(paginationMapsData);

    dispatch(updateMapsState({ key: "mapsScroll", value }));
  }

  function checkAndLoadMoreData() {
    const isLastPage = getIsLastPagination(mapsData, paginationNumber);
    const previousPage = pageVisits.at(-1);
    const cameFromDifferentPage = previousPage !== "/maps";

    // In this case the handleShowAll() is invoked already
    const isSameArrayReference = mapsScroll === mapsData;

    const shouldLoadMoreData =
      !isLastPage &&
      !allDataDisplayed &&
      !isSameArrayReference &&
      !cameFromDifferentPage;

    if (shouldLoadMoreData) addDataOnScroll();
  }

  useEffect(() => {
    dispatch(fetchMaps(paramsObject));
    setPaginationNumber(1);
  }, [searchParams]);

  useEffect(() => {
    checkAndLoadMoreData();
  }, [paginationNumber]);

  return (
    <section className={`${s.mapsSection} ${collapseClass} ${listClass}`}>
      {loading && !error && (
        <SpinnerLoader
          title="Loading maps..."
          description="Fetching the latest maps"
        />
      )}

      <ViewMaps lastMapRef={lastMapRef} mapsScroll={mapsScroll} />
    </section>
  );
};

export default Maps;
