import s from "./AboutSection.module.scss";

const AboutSection = ({ children, title, contentVisibility = false }) => {
  const sectionClasses = `${s.section} ${contentVisibility ? s.contentVisibility : ""}`;
  const sectionId = normalizeSectionTitle(title);

  return (
    <section className={sectionClasses} aria-labelledby={sectionId}>
      <h2 className={s.sectionTitle} id={sectionId}>
        {title}
      </h2>
      <article className={s.card} data-type="about-card">
        {children}
      </article>
    </section>
  );
};

export default AboutSection;

function normalizeSectionTitle(title) {
  return `about-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}
