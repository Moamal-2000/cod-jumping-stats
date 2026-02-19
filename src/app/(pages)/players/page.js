import PlayersPage from "@/components/Pages/PlayersPage/PlayersPage";
import PlayerToolTip from "@/components/Pages/ServersPage/PlayerToolTip/PlayerToolTip";
import { Suspense } from "react";

export const metadata = {
  title: "Players | JumpersHeaven",
  description:
    "Explore JumpersHeaven players, compare profile stats, and find players by performance and activity.",
};

const Page = () => {
  return (
    <div className="container">
      <main>
        <Suspense>
          <PlayersPage />
        </Suspense>
        <PlayerToolTip />
      </main>
    </div>
  );
};

export default Page;
