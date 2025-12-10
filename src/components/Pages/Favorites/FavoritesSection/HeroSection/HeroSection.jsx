import s from "./HeroSection.module.scss";

const HeroSection = () => {
  return (
    <section className={s.hero}>
      <div className={s.content}>
        <div className={s.titleWrapper}>
          <h1 className={s.title}>Your Favorites</h1>

          <svg className={s.icon} aria-hidden="true">
            <use href="/icons-sprite.svg#heart" />
          </svg>
        </div>

        <p className={s.description}>
          Keep track of your favorite maps and players all in one place. Quick
          access to everything you love.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
