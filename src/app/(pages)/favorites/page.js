import Favorites from "@/components/Pages/Favorites/Favorites/Favorites";
import { Suspense } from "react";

export const metadata = {
  title: "Favorites | JumpersHeaven",
  description:
    "Access your saved JumpersHeaven players and maps in one place to quickly revisit the profiles and content you follow.",
};

const FavoritesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Favorites />
    </Suspense>
  );
};

export default FavoritesPage;
