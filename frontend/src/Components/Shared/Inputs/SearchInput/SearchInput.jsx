"use client";

import s from "./SearchInput.module.scss";

const SearchInput = ({ placeholder }) => {
  function handleSearch(event) {
    event.preventDefault();

    const formEle = event.currentTarget;
    const inputValue = new FormData(formEle).get("search-player");
  }

  return (
    <form
      className={s.input}
      onClick={focusOnInput}
      onSubmit={handleSearch}
      role="search"
    >
      <button
        type="submit"
        className={s.searchButton}
        aria-label="Search for a player by name"
      >
        <svg>
          <use href="/icons-sprite.svg#search" />
        </svg>
      </button>

      <input
        type="text"
        placeholder={placeholder}
        name="search-player"
        aria-label="Enter player name to search"
      />
    </form>
  );
};

export default SearchInput;

function focusOnInput(event) {
  const inputEle = event.currentTarget.querySelector("input");
  const isFocused = document.activeElement === inputEle;

  if (isFocused) return;
  inputEle?.focus();
}
