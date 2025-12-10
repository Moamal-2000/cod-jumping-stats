"use client";

import { useCallback, useRef } from "react";
import s from "./Tabs.module.scss";

/**
 * Accessible tabs component with keyboard navigation.
 * Follows WAI-ARIA Tabs Pattern for full accessibility.
 *
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects with id, label, icon, and count
 * @param {string} props.activeTab - Currently active tab id
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {string} props.ariaLabel - Accessible label for the tablist
 */
const Tabs = ({ tabs, activeTab, onTabChange, ariaLabel = "Content tabs" }) => {
  const tabRefs = useRef({});

  /**
   * Handle keyboard navigation between tabs
   */
  const handleKeyDown = useCallback(
    (event, currentIndex) => {
      const tabIds = tabs.map((tab) => tab.id);
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case "ArrowRight":
          event.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case "Home":
          event.preventDefault();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      const newTabId = tabIds[newIndex];
      onTabChange(newTabId);
      tabRefs.current[newTabId]?.focus();
    },
    [tabs, onTabChange]
  );

  return (
    <nav className={s.tabsNav} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`${s.tab} ${isActive ? s.active : ""}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
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
