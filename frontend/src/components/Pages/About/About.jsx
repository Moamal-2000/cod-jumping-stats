import s from "./About.module.scss";
import AboutSection from "./AboutSection/AboutSection";

const About = () => {
  return (
    <main className={s.aboutPage}>
      <div className="container">
        <AboutSection title="Project Overview">
          <p className={s.description}>
            JumpersHeaven is a Call of Duty 2 mod created by{" "}
            <strong>Iznogod</strong>, featuring custom servers maintained by the
            mod creator. JH Stats is an independent leaderboard system that
            retrieves and displays data from the JumpersHeaven database.
          </p>
          <p className={s.description}>
            JH Stats provides players with comprehensive statistics, rankings,
            and achievements within the JumpersHeaven community, offering a
            modern web interface to explore player performance and map
            completion data.
          </p>
        </AboutSection>

        <AboutSection title="Development Team">
          <div className={s.teamGrid} role="list">
            <div className={s.teamMember} role="listitem">
              <div className={s.memberInfo}>
                <strong className={s.memberName}>Dcoy</strong>
                <p className={s.memberRole}>
                  Backend Developer & Frontend Contributor
                </p>
              </div>

              <p className={s.memberDescription}>
                Did the backend and worked on the frontend development of the
                leaderboard system.
              </p>
            </div>

            <div className={s.teamMember} role="listitem">
              <div className={s.memberInfo}>
                <strong className={s.memberName}>Moamal</strong>
                <p className={s.memberRole}>Frontend Developer</p>
              </div>

              <p className={s.memberDescription}>
                Worked on the frontend development of the leaderboard platform.
              </p>
            </div>
          </div>
        </AboutSection>

        <AboutSection title="Technical Information">
          <div className={s.techGrid}>
            <div className={s.techItem}>
              <h3 className={s.techTitle}>Independence</h3>
              <p className={s.techDescription}>
                Our project operates independently from JumpersHeaven. We simply
                retrieve and display data from their database without any direct
                affiliation or dependency on their systems.
              </p>
            </div>

            <div className={s.techItem}>
              <h3 className={s.techTitle}>Data Source</h3>
              <p className={s.techDescription}>
                All leaderboard data is sourced from the JumpersHeaven database
                with permission from Iznogod. We maintain data integrity while
                providing enhanced visualization and user experience.
              </p>
            </div>

            <div className={s.techItem}>
              <h3 className={s.techTitle}>Modern Web Interface</h3>
              <p className={s.techDescription}>
                Built with modern web technologies to provide a responsive,
                fast, and user-friendly experience for exploring player
                statistics and achievements.
              </p>
            </div>
          </div>
        </AboutSection>

        <div className={s.wrapper}>
          <AboutSection title="Community">
            <p className={s.description}>
              JH Stats serves the JumpersHeaven community by providing easy
              access to player statistics, map completion records, and
              competitive rankings. Whether you&apos;re a casual player or a
              competitive jumper, our platform helps you track your progress and
              compare your achievements with others.
            </p>
            <p className={s.description}>
              We&apos;re committed to maintaining an accurate, up-to-date, and
              user-friendly platform that enhances the JumpersHeaven gaming
              experience.
            </p>
          </AboutSection>

          <AboutSection title="Special Thanks">
            <p className={s.description}>
              Special thanks to <strong>Iznogod</strong> for creating the
              original JumpersHeaven Call of Duty 2 mod and maintaining the
              servers. Without his work and the database access he provided,
              this leaderboard project would not have been possible.
            </p>
          </AboutSection>
        </div>
      </div>
    </main>
  );
};

export default About;
