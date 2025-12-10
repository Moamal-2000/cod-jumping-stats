"use client";

import { useRef } from "react";
import s from "./Tabs.module.scss";

const Tabs = ({ tabs, activeTab, onTabChange, ariaLabel = "Content tabs" }) => {
  const tabRefs = useRef({});

  return (
    <nav className={s.tabsNav} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            className={`${s.tab} ${isActive ? s.active : ""}`}
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) =>
              handleKeyDown({ event, index, tabs, tabRefs, onTabChange })
            }
          >
            {tab.icon && (
              <svg className={s.icon} aria-hidden="true">
                <use href={`/icons-sprite.svg#${tab.icon}`} />
              </svg>
            )}
            <span className={s.label}>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span className={s.count} aria-label={`${tab.count} items`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Tabs;

function handleKeyDown({ event, index, tabs, tabRefs, onTabChange } = {}) {
  const tabIds = tabs.map((tab) => tab.id);
  let newIndex = index;

  event.preventDefault();

  switch (event.key) {
    case "ArrowLeft":
      newIndex = index > 0 ? index - 1 : tabs.length - 1;
      break;
    case "ArrowRight":
      newIndex = index < tabs.length - 1 ? index + 1 : 0;
      break;
    case "Home":
      newIndex = 0;
      break;
    case "End":
      newIndex = tabs.length - 1;
      break;
    default:
      return;
  }

  const newTabId = tabIds[newIndex];
  onTabChange(newTabId);
  tabRefs.current[newTabId]?.focus();
}
