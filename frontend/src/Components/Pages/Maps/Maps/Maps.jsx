"use client";

import { getIsLastPagination, paginateData } from "@/Functions/utils";
import { updateMapsState } from "@/Redux/slices/mapsSlice";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinnerLoader from "../../../Shared/Loaders/SpinnerLoader/SpinnerLoader";
import s from "./Maps.module.scss";
import ViewMaps from "./ViewMaps/ViewMaps";

const Maps = ({ paginationNumber, setPaginationNumber, lastMapRef }) => {
  const dispatch = useDispatch();
  const {
    mapsScroll,
    allDataDisplayed,
    loading,
    error,
    searchTerm,
    filteredMaps,
    sortedMaps,
  } = useSelector((s) => s.maps);
  const { pageVisits, isMapsExpanded } = useSelector((s) => s.global);
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || "grid";
  const paramsObject = Object.fromEntries(searchParams.entries());
  const collapseClass = isMapsExpanded ? "" : s.collapse;
  const listClass = viewType === "list" ? s.list : "";

  function addDataOnScroll() {
    const paginationMapsData = paginateData(sortedMaps, paginationNumber);
    const value = mapsScroll.concat(paginationMapsData);

    dispatch(updateMapsState({ key: "mapsScroll", value }));
  }

  function checkAndLoadMoreData() {
    const isLastPage = getIsLastPagination(sortedMaps, paginationNumber);
    const lastVisitedPage = pageVisits?.[pageVisits.length - 1];
    const cameFromDifferentPage =
      lastVisitedPage !== "/maps" && lastVisitedPage !== undefined;

    // In this case the handleShowAll() is activated already
    const isSameArrayReference = mapsScroll === sortedMaps;

    const shouldLoadMoreData =
      !isLastPage &&
      !allDataDisplayed &&
      !isSameArrayReference &&
      !cameFromDifferentPage;

    if (shouldLoadMoreData) addDataOnScroll();
  }

  function getMapsData() {
    dispatch(fetchMaps(paramsObject));
    setPaginationNumber(1);
  }

  useEffect(() => {
    getMapsData();
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

      <ViewMaps
        lastMapRef={lastMapRef}
        mapsScroll={mapsScroll}
        searchTerm={searchTerm}
        filteredMaps={filteredMaps}
      />
    </section>
  );
};

export default Maps;
