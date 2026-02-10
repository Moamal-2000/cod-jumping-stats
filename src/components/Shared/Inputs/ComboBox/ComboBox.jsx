"use client";

import { createQueryString, removeQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import s from "./ComboBox.module.scss";

const ComboBox = ({
  id,
  placeholder = "Select...",
  options = [],
  disabled = false,
  emptyText = "No results",
  clearLabel = "Clear field",
  queryName,
  alphaOrder = false,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentValue = searchParams.get(queryName) || "";
  const listId = id ? `${id}-listbox` : "combobox-listbox";

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const wrapperRef = useRef(null);
  const clearButtonRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const autoSelectRef = useRef(false);

  const normalizedOptions = normalizeOptions(options, alphaOrder);

  function handleToggle() {
    if (disabled) return;

    setIsOpen((prev) => !prev);
    if (!isOpen) inputRef.current?.focus();
  }

  function handleInputChange(event) {
    if (disabled) return;
    if (!isOpen) setIsOpen(true);
    clearTimeout(debounceRef?.current);

    const value = event.target.value.toLowerCase().trim();
    setInputValue(value);
    debounceRef.current = setTimeout(() => updateUrlQuery(value), 300);

    const optionValues = normalizedOptions.map(({ value }) => value);
    const isInOptionsList = optionValues.includes(value);

    if (isInOptionsList) setSelectedValue(value);
    if (!isInOptionsList) setSelectedValue("");
    autoSelectRef.current = isInOptionsList;
  }

  function updateUrlQuery(searchValue) {
    if (searchValue.trim() === "") {
      removeQueryString(queryName, searchParams, router, pathname);
      return;
    }

    createQueryString(
      queryName,
      searchValue.toLowerCase(),
      searchParams,
      router,
      pathname,
    );
  }

  function handleSelect(option, { closeMenu = true } = {}) {
    const { label, value } = option;

    setInputValue(label);
    setSelectedValue(value);
    createQueryString(queryName, value, searchParams, router, pathname);

    setIsOpen(!closeMenu);
  }

  function handleClear() {
    if (disabled) return;
    inputRef.current?.focus();

    setInputValue("");
    setSelectedValue("");
    removeQueryString(queryName, searchParams, router, pathname);

    setIsOpen(true);
  }

  function handleKeyDown(event) {
    const key = event.key;
    const isArrowDown = key === "ArrowDown";
    const isArrowUp = key === "ArrowUp";
    const isClosingKeyPressed =
      key === "Escape" || (key === "Enter" && inputValue !== "");

    if (isClosingKeyPressed) {
      setIsOpen(false);
      inputRef.current?.blur();
    }

    if (isArrowDown || isArrowUp)
      handleArrowNavigation({ isArrowDown, isArrowUp });
  }

  function handleArrowNavigation({ isArrowDown, isArrowUp } = {}) {
    const optionValues = normalizedOptions.map(({ value }) => value);
    const isInOptionsList = optionValues.includes(inputValue);

    if (isOpen && !isInOptionsList) {
      handleSelect(normalizedOptions[0], { closeMenu: false });
      return;
    }

    if (!isOpen || !isInOptionsList) return;

    const selectedOptionIndex = optionValues.indexOf(selectedValue);
    const isLast = selectedOptionIndex >= optionValues.length - 1;
    const isFirst = selectedOptionIndex === 0;

    let optionIndex = selectedOptionIndex;

    if (isArrowDown && !isLast) optionIndex += 1;
    if (isArrowUp && !isFirst) optionIndex -= 1;

    if (isArrowDown && isLast) optionIndex = 0;
    if (isArrowUp && isFirst) optionIndex = normalizedOptions.length - 1;

    const newSelectValue = normalizedOptions[optionIndex];
    if (newSelectValue !== undefined)
      handleSelect(newSelectValue, { closeMenu: false });
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      const isComboClicked = wrapperRef.current?.contains(event.target);
      const isClearButtonRemoved = clearButtonRef.current === null;
      const isInputFocused = document.activeElement === inputRef.current;

      const openMenu =
        (isComboClicked && isClearButtonRemoved) || isInputFocused;

      setIsOpen(openMenu);
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !autoSelectRef.current) return;
    autoSelectRef.current = false;

    const target = wrapperRef.current?.querySelector(
      `[data-combobox-value="${selectedValue}"]`,
    );

    if (target) {
      target.scrollIntoView({ block: "nearest" });
    }
  }, [selectedValue, isOpen]);

  return (
    <div className={s.comboBox} ref={wrapperRef}>
      <div
        className={`${s.inputRow} ${isOpen ? s.open : ""} ${
          disabled ? s.disabled : ""
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={s.input}
        />

        <button
          type="button"
          aria-label={clearLabel}
          onClick={handleClear}
          disabled={disabled || inputValue === ""}
          className={`${s.clearButton} ${inputValue === "" ? s.hide : ""}`}
          ref={clearButtonRef}
          aria-hidden={inputValue === ""}
          tabIndex={inputValue === "" ? -1 : 0}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#xMark" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Toggle options"
          onClick={handleToggle}
          disabled={disabled}
          className={s.toggleButton}
        >
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#solidArrow" />
          </svg>
        </button>
      </div>

      <div
        className={`${s.optionsList} ${isOpen ? s.visible : ""}`}
        id={listId}
        role="listbox"
      >
        {normalizedOptions.length === 0 && (
          <div className={s.emptyState}>{emptyText}</div>
        )}

        <div className={s.options}>
          {normalizedOptions.map((option) => {
            const isActive = option.value === selectedValue;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`${s.optionButton} ${isActive ? s.active : ""}`}
                onClick={() => handleSelect(option)}
                data-combobox-value={option.value}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComboBox;

function normalizeOptions(options, alphaOrder = false) {
  let normalizedOptions = options.map((option) => ({
    id: option?.id ?? option?.value ?? option?.label ?? String(option),
    label: option?.label ?? String(option?.value ?? option),
    value: option?.value ?? option?.label ?? option,
  }));

  if (alphaOrder)
    normalizedOptions.sort((a, b) => a.label.localeCompare(b.label));

  return normalizedOptions;
}
