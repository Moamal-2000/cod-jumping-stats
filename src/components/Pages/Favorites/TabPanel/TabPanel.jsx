import s from "./TabPanel.module.scss";

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
