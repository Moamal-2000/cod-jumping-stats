import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPlayerRouteCompletionNew = createAsyncThunk(
  "playerProfileSlice/fetchPlayerRouteCompletionNew",
  async ({ playerId }) => {
    try {
      // Fetch player's completed routes using the dedicated endpoint
      const playerRoutesResponse = await fetch(
        `/api/localhost/player/routes-completion?playerid=${playerId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!playerRoutesResponse.ok) {
        throw new Error(`HTTP error! status: ${playerRoutesResponse.status}`);
      }

      const playerRoutesData = await playerRoutesResponse.json();

      // Process completed routes
      const playerCompletedMaps = new Set();
      const playerMapDetails = {};

      if (Array.isArray(playerRoutesData)) {
        playerRoutesData.forEach((route) => {
          if (route.map_name) {
            // Create unique key for map + ender combination
            const mapKey = route.ender
              ? `${route.map_name} (${route.ender})`
              : route.map_name;
            playerCompletedMaps.add(mapKey);
            playerMapDetails[mapKey] = {
              map_id: route.map_id,
              total_finishes: route.total_finishes,
              fps_list: route.fps_list,
              player_name: route.player_name,
              ender: route.ender,
            };
          }
        });
      }

      // Fetch all available maps
      const allMapsResponse = await fetch("/api/localhost/map/all", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!allMapsResponse.ok) {
        throw new Error(`HTTP error! status: ${allMapsResponse.status}`);
      }

      const allMapsData = await allMapsResponse.json();

      // Use all maps without any filtering (type and FPS agnostic)
      const availableMaps = allMapsData;

      // Process maps to handle multiple routes/endings using the 'ender' field
      const processedMaps = availableMaps.map((map) => {
        if (map.ender && map.ender !== null) {
          // Multiple routes - add ender name to display name
          return {
            ...map,
            displayName: `${map.mapname} (${map.ender})`,
          };
        } else {
          // Single route - use original mapname
          return {
            ...map,
            displayName: map.mapname,
          };
        }
      });

      const totalAvailableMaps = processedMaps.length;
      const completedMapsCount = playerCompletedMaps.size;
      const completionRate =
        totalAvailableMaps > 0
          ? ((completedMapsCount / totalAvailableMaps) * 100).toFixed(2)
          : 0;

      // Create detailed completion data
      const completionDetails = processedMaps.map((map) => {
        // Check if this specific route is completed
        const isCompleted = playerCompletedMaps.has(map.displayName);
        const playerDetails = playerMapDetails[map.displayName] || null;

        // Get difficulty for 125 FPS as default
        const difficulty = map.difficulty?.["125"]?.difficulty || 0;

        // Get individual finish count - try different possible field names
        let individual_finish_count =
          map.individual_finish_count ||
          map.individualFinishCount ||
          map.finish_count ||
          map.finishCount ||
          map.total_finishes ||
          map.totalFinishes ||
          0;

        // If still 0, try to calculate from difficulty data
        if (individual_finish_count === 0 && map.difficulty) {
          // Sum up the nb_tops from all FPS settings
          const totalTops = Object.values(map.difficulty).reduce(
            (sum, fpsData) => {
              return sum + (fpsData.nb_tops || 0);
            },
            0
          );
          individual_finish_count = totalTops;
        }

        // If still 0, set a default value
        if (individual_finish_count === 0) {
          individual_finish_count = 1; // Default to 1 if no data available
        }

        return {
          mapid: map.mapid,
          mapname: map.displayName, // Use displayName for showing route info
          originalMapname: map.mapname, // Keep original for completion checking
          cp_id: map.cp_id,
          author: map.author,
          released: map.released,
          type: map.type,
          difficulty: difficulty,
          isCompleted,
          playerDetails,
          individual_finish_count: individual_finish_count,
        };
      });

      // Separate completed and not completed maps
      const completedMaps = completionDetails.filter((map) => map.isCompleted);
      const notCompletedMaps = completionDetails.filter(
        (map) => !map.isCompleted
      );

      return {
        playerId,
        totalAvailableMaps,
        completedMapsCount,
        completionRate: `${completionRate}%`,
        completionDetails,
        completedMaps,
        notCompletedMaps,
        playerMapDetails,
      };
    } catch (error) {
      console.error("Error fetching player route completion:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        playerId: playerId,
      });

      // Return a fallback structure to prevent app crash
      return {
        playerId,
        totalAvailableMaps: 0,
        completedMapsCount: 0,
        completionRate: "0%",
        completionDetails: [],
        completedMaps: [],
        notCompletedMaps: [],
        playerMapDetails: {},
        error: error.message,
      };
    }
  }
);
