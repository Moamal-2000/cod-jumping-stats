"use client";

import Image from "next/image";
import { useState } from "react";
import s from "./CountryImage.module.scss";

const CountryImage = ({
  countryCode,
  countryName,
  size = 32,
  colorPlaceholder = false,
}) => {
  const [src, setSrc] = useState(
    `/countryFlags/${countryCode?.toLowerCase()}.svg`
  );
  const [alt, setAlt] = useState(`country flag ${countryName}`);
  const [title, setTitle] = useState(countryName);

  const classes =
    colorPlaceholder && alt === "Unknown country" ? s.placeholder : "";

  function handleError() {
    setSrc("/placeholders/country-placeholder.svg");
    setAlt("Unknown country");
    setTitle("Unknown country");
  }

  return (
    <Image
      width={size}
      height={size}
      src={src}
      alt={alt}
      title={title}
      onError={handleError}
      className={classes}
    />
  );
};

export default CountryImage;
