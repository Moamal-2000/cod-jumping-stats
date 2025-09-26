"use client";

import FiltersSection from "@/Components/Pages/Leaderboards/FiltersSection/FiltersSection";
import LeaderBoard from "@/Components/Pages/Leaderboards/LeaderBoard/LeaderBoard";
import { Suspense } from "react";

const LeaderboardsPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <FiltersSection />
          <LeaderBoard />
        </Suspense>
      </main>
    </div>
  );
};

export default LeaderboardsPage;
