"use client";

import { normalizeFpsQuery } from "@/components/Footer/formatting";
import { DEFAULT_FPS } from "@/data/constants";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./FpsButtons.module.scss";

const FpsButtons = ({ options = [] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));

  function handleClick(fps) {
    createQueryString(
      "fps",
      normalizeFpsQuery(fps),
      searchParams,
      router,
      pathname,
    );

    if (normalizeFpsQuery(fps) === DEFAULT_FPS) {
      removeQueryString("fps", searchParams, router, pathname);
    }
  }

  return (
    <div className={s.fpsButtons} role="tablist" aria-label="FPS selector">
      {options.map((fps) => (
        <button
          key={fps}
          type="button"
          role="tab"
          aria-selected={selectedFps === fps}
          aria-pressed={selectedFps === fps}
          aria-label={`Show ${fps === "mix" ? "Mixed" : fps} FPS leaderboards`}
          className={selectedFps === fps ? s.active : ""}
          onClick={() => handleClick(fps)}
        >
          {fps === "mix" ? "Mixed" : fps}
        </button>
      ))}
    </div>
  );
};
export default FpsButtons;
