"use client";

import { COD2_COLORS, COD2_HEX_COLORS } from "@/data/staticData";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import s from "./PlayersColorFilter.module.scss";

const PlayersColorFilter = () => {
  const { allPlayersData } = useSelector((state) => state.players);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const selectedColorsParam = searchParams?.get("colors") || "";
  const selectedColors = selectedColorsParam
    ? selectedColorsParam.split(",").map((c) => c.trim())
    : [];

  // Extract available colors from players data
  const getAvailableColors = () => {
    const colorCodeRegex = /\^(\d)/g;
    const availableColorCodes = new Set();

    allPlayersData.forEach((player) => {
      const playerName = player.PlayerName || player.PrefName || "";
      const matches = [...playerName.matchAll(colorCodeRegex)];
      matches.forEach((m) => {
        availableColorCodes.add(m[1]);
      });
    });

    return Array.from(availableColorCodes).sort();
  };

  const availableColors = getAvailableColors();

  function handleColorToggle(colorCode) {
    const colorStr = String(colorCode);

    if (selectedColors.includes(colorStr)) {
      const newColors = selectedColors.filter((c) => c !== colorStr);

      if (newColors.length === 0) {
        removeQueryString("colors", searchParams, router, pathname);
      } else {
        createQueryString(
          "colors",
          newColors.join(","),
          searchParams,
          router,
          pathname,
        );
      }
    } else {
      const newColors = [...selectedColors, colorStr].sort();
      createQueryString(
        "colors",
        newColors.join(","),
        searchParams,
        router,
        pathname,
      );
    }
  }

  function handleClearAll() {
    removeQueryString("colors", searchParams, router, pathname);
  }

  const isAnyColorSelected = selectedColors.length > 0;

  return (
    <div className={s.filterGroup} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`${s.menuButton} ${isMenuOpen ? s.open : ""} ${isAnyColorSelected ? s.hasSelection : ""}`}
      >
        <span className={s.buttonLabel}>
          {isAnyColorSelected
            ? `Colors (${selectedColors.length})`
            : "Filter by Colors"}
        </span>
        <span className={s.chevron}>▼</span>
      </button>

      {isMenuOpen && availableColors.length > 0 && (
        <div className={s.menu}>
          <div className={s.menuHeader}>
            <span className={s.menuTitle}>Select Player Colors</span>
            {isAnyColorSelected && (
              <button
                type="button"
                onClick={handleClearAll}
                className={s.clearButton}
              >
                Clear All
              </button>
            )}
          </div>

          <div className={s.colorsList}>
            {availableColors.map((colorCode) => {
              const colorName = COD2_COLORS[colorCode] || `Color ${colorCode}`;
              const colorHex = COD2_HEX_COLORS[colorName] || "#999";
              const isSelected = selectedColors.includes(String(colorCode));

              return (
                <label key={colorCode} className={s.colorCheckbox}>
                  <input
                    type="checkbox"
                    value={colorCode}
                    checked={isSelected}
                    onChange={() => handleColorToggle(colorCode)}
                    className={s.checkbox}
                  />
                  <span className={s.colorBox}>
                    <span
                      className={s.colorDot}
                      style={{ backgroundColor: colorHex }}
                      title={colorName}
                    />
                  </span>
                  <span className={s.colorLabel}>{colorName}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {isMenuOpen && availableColors.length === 0 && (
        <div className={s.menu}>
          <div className={s.emptyState}>No colored players found</div>
        </div>
      )}
    </div>
  );
};

export default PlayersColorFilter;
