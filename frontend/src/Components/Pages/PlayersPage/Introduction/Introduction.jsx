import SearchInput from "@/Components/Shared/Inputs/SearchInput/SearchInput";
import s from "./Introduction.module.scss";

const Introduction = () => {
  return (
    <section className={s.introduction}>
      <h1>Global Rankings</h1>
      <p>Top players ranked by overall performance and achievements</p>

      <SearchInput placeholder="Search by player name..." />
    </section>
  );
};

export default Introduction;
