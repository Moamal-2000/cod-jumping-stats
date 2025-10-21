import PlayerProfileLayout from "@/Components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import { Suspense } from "react";

const PlayerLayout = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerProfileLayout>{children}</PlayerProfileLayout>
    </Suspense>
  );
};

export default PlayerLayout;
