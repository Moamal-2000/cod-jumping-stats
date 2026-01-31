import Link from "next/link";
import s from "./About.module.scss";
import AboutSection from "./AboutSection/AboutSection";

const About = () => {
  return (
    <div className="container">
      <main className={s.aboutPage}>
        <AboutSection title="Project Overview">
          <p className={s.description}>
            <Link
              href="https://jumpersheaven.com/"
              target="_blank"
              rel="noopener"
              className={s.highlight}
            >
              JumpersHeaven
            </Link>{" "}
            is a{" "}
            <Link
              href="https://en.wikipedia.org/wiki/Call_of_Duty_2"
              target="_blank"
              rel="noopener"
              className={s.highlight}
            >
              Call of Duty 2
            </Link>{" "}
            mod created by <strong>IzNoGoD</strong>, featuring custom servers
            maintained by the mod creator. <strong>JH Stats</strong> is an
            independent leaderboard system that retrieves and displays data from
            the <strong>JumpersHeaven</strong> database.
          </p>
          <p className={s.description}>
            JH Stats provides players with comprehensive statistics, rankings,
            and achievements within the <strong>JumpersHeaven</strong>{" "}
            community, offering a modern web interface to explore player
            performance and map completion data.
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
                <Link
                  href="https://moamalalaa.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.memberName}
                >
                  Moamal
                </Link>
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
                Our project operates independently from{" "}
                <strong>JumpersHeaven</strong>. We simply retrieve and display
                data from their database without any direct affiliation or
                dependency on their systems.
              </p>
            </div>

            <div className={s.techItem}>
              <h3 className={s.techTitle}>Data Source</h3>
              <p className={s.techDescription}>
                All leaderboard data is sourced from the{" "}
                <strong>JumpersHeaven</strong> database with permission from{" "}
                <strong>IzNoGoD</strong>. We maintain data integrity while
                providing enhanced visualization and user experience.
              </p>
            </div>

            <div className={s.techItem}>
              <h3 className={s.techTitle}>Modern Web Interface</h3>
              <p className={s.techDescription}>
                Built with modern web technologies to provide a responsive,
                fast, and user-friendly experience for{" "}
                <strong>exploring player statistics</strong> and achievements.
              </p>
            </div>
          </div>
        </AboutSection>

        <div className={s.wrapper}>
          <AboutSection title="Community">
            <p className={s.description}>
              <strong>JH Stats</strong> serves the{" "}
              <strong>JumpersHeaven</strong> community by providing easy access
              to <strong>player statistics</strong>,{" "}
              <strong>map completion records</strong>, and competitive rankings.
              Whether you&apos;re a casual player or a competitive jumper, our
              platform helps you <strong>track your progress</strong> and
              compare your achievements with others.
            </p>
            <p className={s.description}>
              We&apos;re committed to maintaining an accurate, up-to-date, and
              user-friendly platform that enhances the{" "}
              <strong>JumpersHeaven</strong> gaming experience.
            </p>
          </AboutSection>

          <AboutSection title="Special Thanks">
            <p className={s.description}>
              Special thanks to <strong>IzNoGoD</strong> for creating the
              original <strong>JumpersHeaven Call of Duty 2 mod</strong> and
              maintaining the servers. Without his work and the database access
              he provided, this leaderboard project would not have been
              possible.
            </p>
          </AboutSection>
        </div>
      </main>
    </div>
  );
};

export default About;
