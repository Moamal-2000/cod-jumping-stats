"use client";

import { updateGlobalState } from "@/redux/features/global/slice/globalSlice";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useTrackPageVisits = (limit = 5) => {
  const pageVisits = useSelector((s) => s.global.pageVisits);

  const currentPage = usePathname();
  const dispatch = useDispatch();

  function watchPageVisits() {
    const visitsClone = [...pageVisits];

    if (limit === +visitsClone.length) visitsClone.shift();
    visitsClone.push(currentPage);

    dispatch(updateGlobalState({ key: "pageVisits", value: visitsClone }));
  }

  useLayoutEffect(() => {
    watchPageVisits();
  }, [currentPage]);

  return pageVisits;
};

export default useTrackPageVisits;
