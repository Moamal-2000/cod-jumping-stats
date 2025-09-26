import FiltersSection from "@/Components/Pages/Leaderboards/FiltersSection/FiltersSection";
import LeaderBoard from "@/Components/Pages/Leaderboards/LeaderBoard/LeaderBoard";

const LeaderboardsPage = () => {
  return (
    <div className="container">
      <main>
        <FiltersSection />
        <LeaderBoard />
      </main>
    </div>
  );
};

export default LeaderboardsPage;
