"use client";

import { PAGINATION_ITEMS_PER_PAGE } from "@/Data/constants";
import useInfiniteScroll from "@/Hooks/App/useInfiniteScroll";
import { updateMapsState } from "@/Redux/slices/mapsSlice";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltersSection from "../FiltersSection/FiltersSection";
import Maps from "../Maps/Maps";
import SearchSection from "../SearchSection/SearchSection";
import s from "./MapsPage.module.scss";

const MapsPage = () => {
  const { mapsData, mapsScroll } = useSelector((s) => s.maps);
  const [lastMapRef, paginationNumber, setPaginationNumber] =
    useInfiniteScroll(mapsData);
  const dispatch = useDispatch();

  function updateAllDataDisplayedStatus() {
    const lastMapsPagination = Math.ceil(
      mapsData?.length / PAGINATION_ITEMS_PER_PAGE
    );
    const isLastPagination = paginationNumber >= lastMapsPagination;

    dispatch(
      updateMapsState({
        key: "allDataDisplayed",
        value: isLastPagination,
      })
    );
  }

  useEffect(() => {
    updateAllDataDisplayedStatus();
  }, [mapsScroll]);

  return (
    <div className="container">
      <main className={s.mapsPage}>
        <SearchSection />
        <Suspense>
          <FiltersSection setPaginationNumber={setPaginationNumber} />
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
