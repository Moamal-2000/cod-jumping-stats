"use client";

import { getIsLastPagination } from "@/lib/filters";
import { useCallback, useRef, useState } from "react";

const useInfiniteScroll = (
  data,
  isTableElementReversed = null,
  itemsPerPage = undefined,
) => {
  const [paginationNumber, setPaginationNumber] = useState(1);
  const observer = useRef();

  const lastElementRef = useCallback((node) => {
    if (isTableElementReversed && isTableElementReversed !== null) return;

    const isLastPagination = getIsLastPagination(
      data,
      paginationNumber,
      itemsPerPage,
    );

    if (isLastPagination) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting)
        setPaginationNumber((prevValue) => prevValue + 1);
    });

    if (node) observer.current.observe(node);
  });

  return [lastElementRef, paginationNumber, setPaginationNumber];
};

export default useInfiniteScroll;
