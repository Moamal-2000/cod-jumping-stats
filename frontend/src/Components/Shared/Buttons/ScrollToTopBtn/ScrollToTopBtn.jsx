"use client";

import { useEffect, useRef, useState } from "react";
import s from "./ScrollToTopBtn.module.scss";

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTopHalf, setIsAtTopHalf] = useState(true);
  const debounceId = useRef();
  const title = `Scroll to ${isAtTopHalf ? "down" : "top"}`;

  const buttonClass = `${s.button} ${isVisible ? s.active : ""} ${
    isAtTopHalf ? s.reverse : ""
  }`;

  const scrollToPosition = () => {
    const pageHeight = document.documentElement.scrollHeight;
    const isAtTop = window.scrollY < pageHeight / 2;

    window.scrollTo({
      top: isAtTop ? pageHeight : 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      clearTimeout(debounceId.current);

      debounceId.current = setTimeout(() => {
        const pageHeight = document.documentElement.scrollHeight;

        setIsAtTopHalf(window.scrollY < pageHeight / 2);
        setIsVisible(window.scrollY > 1600);
      }, 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(debounceId.current);
    };
  }, []);

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={scrollToPosition}
      title={title}
    >
      <svg>
        <use href="/badgesIcons.svg#right-arrow" />
      </svg>
    </button>
  );
};

export default ScrollToTopBtn;
