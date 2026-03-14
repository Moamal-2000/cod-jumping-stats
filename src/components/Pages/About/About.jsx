"use client";

import Link from "next/link";
import ToolTip from "../PlayersPage/PlayerCard/PlayerBadges/ToolTip/ToolTip";
import s from "./About.module.scss";
import AboutSection from "./AboutSection/AboutSection";

const About = () => {
  function handleCopyDiscordUsername(username) {
    navigator.clipboard.writeText(username);
  }

  return (
    <div className="container">
      <main className={s.aboutPage}>
        <header className={s.hero} aria-labelledby="page-title">
          <div className={s.heroContent}>
            <h1 className={s.pageTitle} id="page-title">
              About Jumpers Heaven Statistics
            </h1>

            <p className={s.lead}>
              Jumpers Heaven Statistics is an independent web platform for the{" "}
              <Link
                href="https://jumpersheaven.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={s.textLink}
              >
                JumpersHeaven
              </Link>{" "}
              community. It turns player, map, and server data into a format
              that is easier to browse, compare, and understand.
            </p>
          </div>

          <dl className={s.factGrid}>
            {heroFacts.map((fact) => (
              <div className={s.factCard} key={fact.label}>
                <dt className={s.factLabel}>{fact.label}</dt>
                <dd className={s.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <AboutSection title="Project overview">
          <div className={s.featureGrid}>
            <article className={s.featureCard}>
              <h3 className={s.cardTitle}>What JH Stats is</h3>
              <p className={s.bodyText}>
                <Link
                  href="https://jumpersheaven.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.textLink}
                >
                  JumpersHeaven
                </Link>{" "}
                is a Call of Duty 2 jump mod created by <strong>IzNoGoD</strong>
                . JH Stats is a separate project that helps players read that
                ecosystem more easily by surfacing rankings, records,
                completions, and server activity in a modern interface.
              </p>
            </article>

            <article className={s.featureCard}>
              <h3 className={s.cardTitle}>What you can do here</h3>
              <ul className={s.bulletList}>
                <li>
                  Browse global player rankings and compare overall standing.
                </li>
                <li>Explore maps, records, and route completion progress.</li>
                <li>Check active servers and current player activity.</li>
                <li>Save favorite maps and players for faster access.</li>
              </ul>
            </article>
          </div>
        </AboutSection>

        <AboutSection title="How the project works">
          <div className={s.infoGrid}>
            {operationCards.map((card) => (
              <article className={s.infoCard} key={card.title}>
                <h3 className={s.cardTitle}>{card.title}</h3>
                <p className={s.bodyText}>{card.description}</p>
              </article>
            ))}
          </div>
        </AboutSection>

        <AboutSection title="Development team">
          <div className={s.teamGrid}>
            {teamMembers.map((member) => (
              <article className={s.teamCard} key={member.name}>
                <h3 className={s.personName}>
                  {member.href ? (
                    <>
                      <Link
                        href={member.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.textLink}
                      >
                        {member.name}
                      </Link>
                      {member?.discordUser && (
                        <button
                          type="button"
                          className={s.discordUser}
                          onClick={() =>
                            handleCopyDiscordUsername(member.discordUser)
                          }
                        >
                          {member.discordUser}
                          <ToolTip>Copy Discord username</ToolTip>
                        </button>
                      )}
                    </>
                  ) : (
                    member.name
                  )}
                </h3>

                <p className={s.personRole}>{member.role}</p>
                <p className={s.bodyText}>{member.description}</p>
              </article>
            ))}
          </div>
        </AboutSection>

        <AboutSection title="Community and thanks">
          <div className={s.closingGrid}>
            <article className={s.featureCard}>
              <h3 className={s.cardTitle}>Built for the community</h3>
              <p className={s.bodyText}>
                JH Stats is meant to give casual players and competitive jumpers
                the same thing: a straightforward way to understand progress,
                check records, and keep up with the wider community.
              </p>
            </article>

            <article className={s.featureCard}>
              <h3 className={s.cardTitle}>Special thanks</h3>
              <p className={s.bodyText}>
                Special thanks to <strong>IzNoGoD</strong> for creating the
                original JumpersHeaven mod, maintaining the servers, and making
                this project possible through database access.
              </p>
            </article>
          </div>
        </AboutSection>
      </main>
    </div>
  );
};

export default About;

const heroFacts = [
  {
    label: "Purpose",
    value: "A clearer way to browse player, map, and server statistics.",
  },
  {
    label: "Position",
    value: "An independent project built for the JumpersHeaven community.",
  },
  {
    label: "Data access",
    value: "Leaderboard data is displayed with permission from IzNoGoD.",
  },
];

const operationCards = [
  {
    title: "Independent presentation",
    description:
      "JH Stats is maintained separately from JumpersHeaven. It is focused on organizing and presenting the data in a cleaner web experience.",
  },
  {
    title: "Trusted data source",
    description:
      "Player rankings, map completions, and related records are sourced from the JumpersHeaven database with approved access.",
  },
  {
    title: "Readability first",
    description:
      "The interface is designed to make dense statistics easier to scan, compare, and understand on both desktop and mobile screens.",
  },
];

const teamMembers = [
  {
    name: "Dcoy",
    role: "Backend Developer and Frontend Contributor",
    description:
      "Built the backend side of the project and supported frontend implementation where needed.",
  },
  {
    name: "Moamal",
    discordUser: "Moamal_Alaa#8153",
    href: "https://moamalalaa.netlify.app",
    role: "Frontend Developer",
    description:
      "Designed and implemented the full frontend experience, with a focus on clarity, structure, and usability.",
  },
];
