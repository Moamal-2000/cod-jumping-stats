"use client";

import { fetchMaps } from "@/redux/features/maps/thunk/mapsThunk";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Custom hook for managing favorites state and operations.
 * Handles localStorage synchronization and filtering of favorite items.
 *
 * @returns {Object} Favorites state and utility functions
 */
export function useFavorites() {
  const dispatch = useDispatch();
  const allMaps = useSelector((state) => state.maps.allMaps);
  const allPlayersData = useSelector((state) => state.players.allPlayersData);
  const mapsLoading = useSelector((state) => state.maps.loading);
  const playersLoading = useSelector((state) => state.players.loading);

  const [favoriteMaps, setFavoriteMaps] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState({
    mapsIds: [],
    playersIds: [],
  });

  /**
   * Get favorites from localStorage
   */
  const getFavoritesFromStorage = useCallback(() => {
    if (typeof window === "undefined") return { mapsIds: [], playersIds: [] };

    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : { mapsIds: [], playersIds: [] };
    } catch {
      return { mapsIds: [], playersIds: [] };
    }
  }, []);

  /**
   * Remove an item from favorites
   * @param {number|string} id - The ID of the item to remove
   * @param {string} groupKey - Either 'mapsIds' or 'playersIds'
   */
  const removeFromFavorites = useCallback(
    (id, groupKey) => {
      const favorites = getFavoritesFromStorage();

      if (favorites[groupKey]) {
        favorites[groupKey] = favorites[groupKey].filter(
          (itemId) => itemId !== id
        );
        localStorage.setItem("favorites", JSON.stringify(favorites));
        setFavoriteIds(favorites);
      }
    },
    [getFavoritesFromStorage]
  );

  /**
   * Sync favorites from localStorage and filter data
   */
  const syncFavorites = useCallback(() => {
    const favorites = getFavoritesFromStorage();
    setFavoriteIds(favorites);

    // Filter maps
    if (allMaps.length > 0 && favorites.mapsIds) {
      const filteredMaps = allMaps.filter((map) =>
        favorites.mapsIds.includes(map.CpID)
      );
      setFavoriteMaps(filteredMaps);
    }

    // Filter players
    if (allPlayersData.length > 0 && favorites.playersIds) {
      const filteredPlayers = allPlayersData.filter((player) =>
        favorites.playersIds.includes(player.PlayerID)
      );
      setFavoritePlayers(filteredPlayers);
    }
  }, [allMaps, allPlayersData, getFavoritesFromStorage]);

  // Fetch data if not already loaded
  useEffect(() => {
    if (allMaps.length <= 0) dispatch(fetchMaps());
    if (allPlayersData.length <= 0) dispatch(fetchAllPlayers());
  }, [dispatch, allMaps.length, allPlayersData.length]);

  // Sync favorites when data changes
  useEffect(() => {
    syncFavorites();
  }, [syncFavorites]);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "favorites") {
        syncFavorites();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [syncFavorites]);

  return {
    favoriteMaps,
    favoritePlayers,
    favoriteIds,
    removeFromFavorites,
    syncFavorites,
    isLoading: mapsLoading || playersLoading,
    mapsCount: favoriteMaps.length,
    playersCount: favoritePlayers.length,
  };
}
