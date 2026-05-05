"use client";

import { useEffect } from "react";

export const useKeyListeners = ({ ref, listeners, options = {} } = {}) => {
  useEffect(() => {
    const element = ref?.current || window;
    const handler = (event) => handleKeyDown(event, listeners, options);

    element.addEventListener("keydown", handler);
    return () => element.removeEventListener("keydown", handler);
  }, [listeners, options]);
};

function handleKeyDown(event, listeners = {}, options = {}) {
  const {
    preventDefault = false,
    ignoreMeta = true,
    ignoreCtrl = true,
    ignoreAlt = true,
    ignoreShift = false,
    onlyWithoutModifiers = false,
    debugging = false,
  } = options;

  const { metaKey, ctrlKey, altKey, shiftKey, code } = event;

  if (debugging) {
    console.log(event);
  }

  const hasAnyModifier = metaKey || ctrlKey || altKey || shiftKey;

  const isModifierBlocked =
    (onlyWithoutModifiers && hasAnyModifier) ||
    (ignoreMeta && metaKey) ||
    (ignoreCtrl && ctrlKey) ||
    (ignoreAlt && altKey) ||
    (ignoreShift && shiftKey);

  if (isModifierBlocked) {
    return;
  }

  const listener = listeners[code];
  if (!listener) {
    return;
  }

  if (preventDefault) {
    event.preventDefault();
  }

  listener(event);
}
