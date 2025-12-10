"use client";

import s from "./TabPanel.module.scss";

/**
 * Accessible tab panel component for tab content.
 * Only renders content when the tab is active for performance.
 *
 * @param {Object} props
 * @param {string} props.id - Panel id (matches tab id)
 * @param {boolean} props.isActive - Whether this panel is currently active
 * @param {React.ReactNode} props.children - Panel content
 */
const TabPanel = ({ id, isActive, children }) => {
  if (!isActive) return null;

  return (
    <section
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={s.panel}
    >
      {children}
    </section>
  );
};

export default TabPanel;
