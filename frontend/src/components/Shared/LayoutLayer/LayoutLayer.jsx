"use client";

import { updateGlobalState } from "@/redux/slices/globalSlice";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./LayoutLayer.module.scss";

const LayoutLayer = ({ children }) => {
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

  return <div className={s.websiteLayer}>{children}</div>;
};

export default LayoutLayer;
