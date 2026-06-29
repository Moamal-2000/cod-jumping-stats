import { fetchPlayerRouteCompletionNew } from "@/redux/features/playerProfile/thunk/playerRouteCompletionThunk";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const usePlayerRouteCompletion = (playerId) => {
  const [completionData, setCompletionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(
        fetchPlayerRouteCompletionNew({
          playerId: parseInt(playerId, 10),
          source: sourceParam,
        }),
      );

      if (result.payload) {
        setCompletionData(result.payload);
      } else {
        setError("Failed to fetch route completion data");
      }
    } catch (err) {
      setError("Error fetching route completion data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function refetch() {
    await fetchData();
  }

  useEffect(() => {
    if (!playerId) {
      setCompletionData(null);
      return;
    }

    fetchData();
  }, [playerId]);

  return { completionData, loading, error, refetch };
};
