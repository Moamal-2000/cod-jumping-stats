"use client";

import SkeletonMapCard from "@/components/Shared/Loaders/SkeletonLoaders/SkeletonMapCard/SkeletonMapCard";
import { getIsLastPagination, paginateData } from "@/lib/filters";
import { updateMapsState } from "@/redux/features/maps/slice/mapsSlice";
import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
      {!loading && !error && (
        <>
          {Array.from({ length: 6 }, (_, index) =>
            viewType === "list" ? (
              <article className={s.listSkeletonCard} key={`skeleton-${index}`}>
                <div className={`${s.skeletonBox} ${s.listImage}`}></div>

                <div className={s.listMain}>
                  <div className={`${s.skeletonBox} ${s.listTitle}`}></div>
                  <div className={s.listTags}>
                    <div className={`${s.skeletonBox} ${s.listTag}`}></div>
                    <div className={`${s.skeletonBox} ${s.listTag}`}></div>
                    <div className={`${s.skeletonBox} ${s.listTag}`}></div>
                  </div>
                  <div className={`${s.skeletonBox} ${s.listLine}`}></div>
                </div>

                <div className={s.listMeta}>
                  <div className={`${s.skeletonBox} ${s.listLine}`}></div>
                  <div className={`${s.skeletonBox} ${s.listLineShort}`}></div>
                </div>
              </article>
            ) : (
              <SkeletonMapCard key={`skeleton-${index}`} />
            ),
          )}
        </>
      )}

      <ViewMaps lastMapRef={lastMapRef} mapsScroll={mapsScroll} />
    </section>
  );
};

export default Maps;
