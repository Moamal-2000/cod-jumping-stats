"use client";

import { JUMP_FPS } from "@/data/constants";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./SelectFpsButtons.module.scss";

const SelectFpsButtons = ({ defaultFps = 125 }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedFps = searchParams.get("fps") || 125;

  function handleChangeFps(fps) {
    if (fps === defaultFps) {
      removeQueryString("fps", searchParams, router, pathname);
      return;
    }

    createQueryString("fps", fps, searchParams, router, pathname);
  }

  return (
    <div className={s.fpsButtons}>
      {JUMP_FPS.concat([0]).map((fps) => (
        <button
          key={fps}
          className={`${s.fps} ${+selectedFps === +fps ? s.active : ""}`}
          onClick={() => handleChangeFps(fps)}
        >
          {fps === 0 ? "Mix" : fps}
        </button>
      ))}
    </div>
  );
};

export default SelectFpsButtons;
