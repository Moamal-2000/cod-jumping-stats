"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useTrackPageVisits = () => {
  const pageVisits = useSelector((s) => s.global.pageVisits);
  const currentPage = usePathname();
  const dispatch = useDispatch();

  function watchPageVisits() {
    const pageVisitsClone = [...pageVisits];
    pageVisitsClone.push(currentPage);

    dispatch(updateGlobalState({ key: "pageVisits", value: pageVisitsClone }));
  }

  useLayoutEffect(() => {
    watchPageVisits();
  }, [currentPage]);

  return pageVisits;
};

export default useTrackPageVisits;
