import { SORT_MAPS_OPTIONS } from "@/data/staticData";
import { createQueryString, removeQueryString } from "@/lib/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./DropDownMenu.module.scss";

const DropDownMenu = ({ isOpen, currentSortBy, setCurrentSortBy }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const visibleClass = isOpen ? `${s.visible}` : "";

  function handleSelectOption(value, label) {
    const isDefault = value === "completions-high-to-low";

    if (isDefault) {
      setCurrentSortBy("Most Completions");
      removeQueryString("sort-by", searchParams, router, pathname);
      return;
    }

    setCurrentSortBy(label);
    createQueryString("sort-by", value, searchParams, router, pathname);
  }

  return (
    <div
      role="listbox"
      aria-label="Sort maps options"
      className={`${s.optionsList} ${visibleClass}`}
    >
      {SORT_MAPS_OPTIONS.map(({ groupLabel, groupOptions }) => {
        return (
          <div key={groupLabel} className={s.group}>
            <label className={s.groupLabel}>{groupLabel}</label>

            <div className={s.options} role="group">
              {groupOptions.map(({ label, value, id }) => {
                const isActive = currentSortBy === label;

                return (
                  <button
                    key={id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={isActive ? s.active : ""}
                    onClick={() => handleSelectOption(value, label)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DropDownMenu;
