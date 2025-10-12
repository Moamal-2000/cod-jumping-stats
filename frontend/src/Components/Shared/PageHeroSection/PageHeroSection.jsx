import s from "./PageHeroSection.module.scss";

const PageHeroSection = ({ title, description, children }) => {
  return (
    <div className={s.header}>
      <h2>{title}</h2>
      {description && <p className={s.description}>{description}</p>}
      {children}
    </div>
  );
};

export default PageHeroSection;
