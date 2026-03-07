"use client";

import SkeletonMapCard from "@/components/Shared/Loaders/SkeletonLoaders/SkeletonMapCard/SkeletonMapCard";
import SkeletonMapList from "@/components/Shared/Loaders/SkeletonLoaders/SkeletonMapList/SkeletonMapList";
import { SKELETON_LIST } from "@/data/constants";

const MapsSkeletonLoader = ({ viewType, loading, error }) => {
  if (!loading && !error) return null;

  return SKELETON_LIST.map((_, index) =>
    viewType === "list" ? (
      <SkeletonMapList key={`skeleton-${index}`} />
    ) : (
      <SkeletonMapCard key={`skeleton-${index}`} />
    ),
  );
};
export default MapsSkeletonLoader;
