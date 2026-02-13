"use client";

import { PAGINATION_ITEMS_PER_PAGE } from "@/data/constants";
import useInfiniteScroll from "@/hooks/app/useInfiniteScroll";
import { updateMapsState } from "@/redux/features/maps/slice/mapsSlice";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltersSection from "../FiltersSection/FiltersSection";
import Maps from "../Maps/Maps";
import s from "./MapsPage.module.scss";

const MapsPage = () => {
  const { allMaps, mapsData, mapsScroll } = useSelector((s) => s.maps);
  const [lastMapRef, paginationNumber, setPaginationNumber] =
    useInfiniteScroll(mapsData);
  const dispatch = useDispatch();

  function updateAllDataDisplayedStatus() {
    const lastMapsPagination = Math.ceil(
      mapsData?.length / PAGINATION_ITEMS_PER_PAGE,
    );
    const isLastPagination = paginationNumber >= lastMapsPagination;

    dispatch(
      updateMapsState({
        key: "allDataDisplayed",
        value: isLastPagination,
      }),
    );
  }

  useEffect(() => {
    updateAllDataDisplayedStatus();
  }, [mapsScroll]);

  return (
    <div className="container">
      <main className={s.mapsPage}>
        <Suspense>
          <FiltersSection
            setPaginationNumber={setPaginationNumber}
            allMaps={allMaps}
            mapsData={mapsData}
            mapsScroll={mapsScroll}
          />
          <Maps
            paginationNumber={paginationNumber}
            setPaginationNumber={setPaginationNumber}
            lastMapRef={lastMapRef}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default MapsPage;
