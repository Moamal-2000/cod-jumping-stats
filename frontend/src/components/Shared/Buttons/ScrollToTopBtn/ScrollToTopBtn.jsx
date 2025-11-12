"use client";

import { useEffect, useRef, useState } from "react";
import s from "./ScrollToTopBtn.module.scss";

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTopHalf, setIsAtTopHalf] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const animationFrameRef = useRef(null);
  const lastRunRef = useRef(0);

  const label = `Scroll ${isAtTopHalf ? "down" : "top"}`;

  const buttonClass = `${s.button} ${isVisible || isFocused ? s.active : ""} ${
    isAtTopHalf ? s.reverse : ""
  }`;

  useEffect(() => {
    function onScrollRaf() {
      if (animationFrameRef.current) return;

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;

        const pageHeight = document.documentElement.scrollHeight;
        const atTopHalf = window.scrollY < pageHeight / 2;

        setIsAtTopHalf(atTopHalf);
        setIsVisible(window.scrollY > 1600);
      });
    }

    function onScrollThrottled() {
      const now = Date.now();

      if (now - lastRunRef.current < 500) return;

      lastRunRef.current = now;
      onScrollRaf();
    }

    window.addEventListener("scroll", onScrollThrottled, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollThrottled);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  return (
    <button
      type="button"
      className={buttonClass}
      title={label}
      aria-label={label}
      onClick={scrollToPosition}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#right-arrow" />
      </svg>
    </button>
  );
};

export default ScrollToTopBtn;

function scrollToPosition() {
  const pageHeight = document.documentElement.scrollHeight;
  const isAtTop = window.scrollY < pageHeight / 2;

  window.scrollTo({
    top: isAtTop ? pageHeight : 0,
    behavior: "smooth",
  });
}
