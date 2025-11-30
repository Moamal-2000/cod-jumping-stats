"use client";

import { JUMP_FPS } from "@/data/constants";
import { createQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./SelectFpsButtons.module.scss";

const SelectFpsButtons = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedFps = searchParams.get("fps") || 125;

  function handleFpsClick(event) {
    const fps = +event.target.textContent;
    createQueryString("fps", fps, searchParams, router, pathname);
  }

  return (
    <div className={s.fpsButtons}>
      {JUMP_FPS.map((fps) => (
        <button
          key={fps}
          className={`${s.fps} ${+selectedFps === +fps ? s.active : ""}`}
          onClick={handleFpsClick}
        >
          {fps}
        </button>
      ))}
    </div>
  );
};

export default SelectFpsButtons;
