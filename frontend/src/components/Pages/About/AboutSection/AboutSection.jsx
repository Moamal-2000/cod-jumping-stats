import s from "./AboutSection.module.scss";

const AboutSection = ({ children, title }) => {
  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>{title}</h2>
      <div className={s.card} data-type="about-card">
        {children}
      </div>
    </section>
  );
};

export default AboutSection;
