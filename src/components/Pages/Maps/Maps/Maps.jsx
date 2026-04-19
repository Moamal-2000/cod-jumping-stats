"use client";

import { DEFAULT_VIEW_MODE } from "@/data/constants";
import { getIsLastPagination, paginateData } from "@/lib/filters";
import { updateMapsState } from "@/redux/features/maps/slice/mapsSlice";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./Maps.module.scss";
import MapsSkeletonLoader from "./MapsSkeletonLoader/MapsSkeletonLoader";
import ViewMaps from "./ViewMaps/ViewMaps";

const Maps = ({ paginationNumber, setPaginationNumber, lastMapRef }) => {
  const { mapsScroll, allDataDisplayed, loading, error, mapsData } =
    useSelector((s) => s.maps);

  const { pageVisits, isMapsExpanded } = useSelector((s) => s.global);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;
  const paramsObject = Object.fromEntries(searchParams.entries());

  const mapsSectionClasses = getMapsSectionClasses(isMapsExpanded, viewType);

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

    if (shouldLoadMoreData) {
      addDataOnScroll();
    }
  }

  useEffect(() => {
    dispatch(fetchMaps(paramsObject));
    setPaginationNumber(1);
  }, [searchParams]);

  useEffect(() => {
    checkAndLoadMoreData();
  }, [paginationNumber]);

  return (
    <section className={mapsSectionClasses}>
      <MapsSkeletonLoader viewType={viewType} loading={loading} error={error} />
      <ViewMaps lastMapRef={lastMapRef} mapsScroll={mapsScroll} />
    </section>
  );
};

export default Maps;

function getMapsSectionClasses(isMapsExpanded, viewType) {
  return [
    s.mapsSection,
    isMapsExpanded ? "" : s.collapse,
    viewType === "list" ? s.list : "",
  ].join(" ");
}
