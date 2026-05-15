"use client";

import { useEffect, useState } from "react";

const useFakeLoader = ({ delay = 500 } = {}) => {
  const [fakeLoading, setFakeLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFakeLoading(false), delay);
  }, []);

  return fakeLoading;
};
export default useFakeLoader;
