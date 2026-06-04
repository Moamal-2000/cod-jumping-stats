import { fetchPlayerRouteCompletionNew } from "@/redux/features/playerProfile/thunk/playerRouteCompletionThunk";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

/**
 * Custom hook to manage player route completion data
 * Fetches and returns completion data for a specific player
 * This hook should be used by components that need to display or filter route completion data
 */
export const usePlayerRouteCompletion = (playerId) => {
  const [completionData, setCompletionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!playerId) {
      setCompletionData(null);
      return;
    }

    fetchData();
  }, [playerId]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(
        fetchPlayerRouteCompletionNew({ playerId: parseInt(playerId, 10) }),
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

  const refetch = async () => {
    await fetchData();
  };

  return {
    completionData,
    loading,
    error,
    refetch,
  };
};
