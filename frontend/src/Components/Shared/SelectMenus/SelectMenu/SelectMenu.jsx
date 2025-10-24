import s from "./SelectMenu.module.scss";

/*
 * @param optionsData = [ { label: "", value: "", id } ]
 */

const SelectMenu = ({ optionsData, value, onChange, label, id }) => {
  return (
    <div className={s.selectMenuWrapper}>
      {label !== undefined && <label htmlFor={id}>{label}</label>}

      <select value={value} onChange={onChange} id={id}>
        {optionsData.map(({ label, value, id }) => {
          return (
            <option key={id} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectMenu;
