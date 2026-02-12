"use client";

import { createQueryString, removeQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ClearButton from "../../Buttons/ClearButton/ClearButton";
import s from "./ComboBox.module.scss";
import OptionsList from "./OptionsList/OptionsList";

const ComboBox = ({
  id,
  placeholder = "Select...",
  options = [],
  disabled = false,
  emptyText = "No results",
  clearLabel = "Clear field",
  queryName,
  alphaOrder = false,
  orderByMapsCount = false,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentValue = searchParams.get(queryName) || "";
  const listId = id ? `${id}-listbox` : "combobox-listbox";

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);
  const [filterQuery, setFilterQuery] = useState(currentValue);
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const wrapperRef = useRef(null);
  const clearButtonRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const autoSelectRef = useRef(false);

  const sortedOptions = sortOptions({
    options,
    alphaOrder,
    orderByMapsCount,
  });
  const filteredOptions = getFilteredOptions(sortedOptions, filterQuery);

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
    setFilterQuery(value);
    debounceRef.current = setTimeout(() => updateUrlQuery(value), 300);

    const optionValues = sortedOptions.map(({ value }) => value.toLowerCase());
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

  function handleSelect(
    option,
    { closeMenu = true, preserveFilterQuery = false } = {},
  ) {
    const { label, value } = option;

    setInputValue(label);
    if (!preserveFilterQuery) setFilterQuery(label);
    clearTimeout(debounceRef?.current);

    debounceRef.current = setTimeout(() => updateUrlQuery(value), 300);

    setSelectedValue(value);
    setIsOpen(!closeMenu);
  }

  function handleClear() {
    if (disabled) return;
    inputRef.current?.focus();

    setInputValue("");
    setFilterQuery("");
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
    const optionsForNavigation = filteredOptions;
    if (!isOpen || optionsForNavigation.length === 0) return;

    const optionValues = optionsForNavigation.map(({ value }) => value);
    const hasSelectedValue = optionValues.includes(selectedValue);

    if (!hasSelectedValue) {
      const edgeIndex = isArrowUp ? optionsForNavigation.length - 1 : 0;
      const edgeOption = optionsForNavigation[edgeIndex];
      if (!edgeOption) return;

      autoSelectRef.current = true;
      handleSelect(edgeOption, {
        closeMenu: false,
        preserveFilterQuery: true,
      });
      return;
    }

    const selectedOptionIndex = optionValues.indexOf(selectedValue);
    const isLast = selectedOptionIndex >= optionsForNavigation.length - 1;
    const isFirst = selectedOptionIndex === 0;

    let optionIndex = selectedOptionIndex;

    if (isArrowDown && !isLast) optionIndex += 1;
    if (isArrowUp && !isFirst) optionIndex -= 1;

    if (isArrowDown && isLast) optionIndex = 0;
    if (isArrowUp && isFirst) optionIndex = optionsForNavigation.length - 1;

    const newSelectValue = optionsForNavigation[optionIndex];
    if (newSelectValue !== undefined) {
      autoSelectRef.current = true;
      handleSelect(newSelectValue, {
        closeMenu: false,
        preserveFilterQuery: true,
      });
    }
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

        <ClearButton
          label={clearLabel}
          handleClear={handleClear}
          disabled={disabled}
          inputValue={inputValue}
          ref={clearButtonRef}
        />

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

      <OptionsList
        options={filteredOptions}
        selectedValue={selectedValue}
        handleSelect={handleSelect}
        isOpen={isOpen}
        listId={listId}
        emptyText={emptyText}
      />
    </div>
  );
};

export default ComboBox;

function sortOptions({
  options,
  alphaOrder = false,
  orderByMapsCount = false,
} = {}) {
  let normalizedOptions = options;

  if (alphaOrder && !orderByMapsCount)
    normalizedOptions.sort((a, b) => a.label.localeCompare(b.label));

  if (orderByMapsCount)
    normalizedOptions.sort((a, b) => b.madeMapsCount - a.madeMapsCount);

  return normalizedOptions;
}

function getFilteredOptions(options, inputValue) {
  const query = inputValue.trim().toLowerCase();

  if (!query) return options;

  return options.filter(({ label, value }) => {
    const labelValue = String(label).toLowerCase();
    const rawValue = String(value).toLowerCase();

    return labelValue.includes(query) || rawValue.includes(query);
  });
}
