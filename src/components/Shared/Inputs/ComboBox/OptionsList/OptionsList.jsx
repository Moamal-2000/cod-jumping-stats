import s from "./OptionsList.module.scss";

const OptionsList = ({
  options,
  selectedValue,
  handleSelect,
  isOpen,
  listId,
  emptyText,
}) => {
  const classes = `${s.optionsList} ${isOpen ? s.visible : ""}`;

  return (
    <div className={classes} id={listId} role="listbox">
      {options.length === 0 && <div className={s.emptyState}>{emptyText}</div>}

      <div className={s.options}>
        {options.map((option) => {
          const isActive =
            option.value.toLowerCase() === selectedValue.toLowerCase();

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
              {option?.count > 0 && <span>{option.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionsList;
