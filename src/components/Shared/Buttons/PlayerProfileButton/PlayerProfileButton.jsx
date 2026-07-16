"use client";

import { updatePlayerProfileState } from "@/redux/features/playerProfile/slice/playerProfileSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayerProfileButton.module.scss";

const PlayerProfileButton = () => {
  const playerProfileId = useSelector((s) => s.playerProfile.playerProfileId);
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const playerProfileIdLocal = localStorage.getItem("player-profile-id");

    if (playerProfileIdLocal) {
      dispatch(
        updatePlayerProfileState({
          key: "playerProfileId",
          value: playerProfileIdLocal,
        }),
      );
    }
  }, []);

  if (!playerProfileId) {
    return null;
  }

  const currentPagePlayerProfile =
    +pathname.match(/\d+$/g)?.[0] === playerProfileId;

  if (currentPagePlayerProfile) {
    return null;
  }

  return (
    <Link href={`/player/${playerProfileId}`} className={s.profileButton}>
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#address-card" />
      </svg>

      <p className={s.tooltip} role="tooltip">
        Visit your profile
      </p>
    </Link>
  );
};
export default PlayerProfileButton;
