import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPlayerRouteCompletionNew = createAsyncThunk(
  "playerProfileSlice/fetchPlayerRouteCompletionNew",
  async ({ playerId, source }) => {
    try {
      const playerRoutesResponse = await fetchMsgPackResponse({
        url: jhApis({ playerId, source }).player.routesCompletion,
      });

      if (!playerRoutesResponse.ok) {
        throw new Error(`HTTP error! status: ${playerRoutesResponse.status}`);
      }

      const playerRoutesData = await decodeAsyncData(playerRoutesResponse);

      // Process completed routes
      const playerCompletedMaps = new Set();
      const playerMapDetails = {};
      const isArrayData = Array.isArray(playerRoutesData);

      if (isArrayData) {
        playerRoutesData.forEach(
          ({ MapName, Ender, MapID, TotalFinishes, FPSList, PlayerName }) => {
            if (!MapName) {
              return;
            }

            const mapKey = Ender ? `${MapName} (${Ender})` : MapName;
            playerCompletedMaps.add(mapKey);

            playerMapDetails[mapKey] = {
              MapID,
              TotalFinishes,
              FPSList,
              PlayerName,
              Ender,
            };
          },
        );
      }

      // Fetch all available maps
      const allMapsResponse = await fetchMsgPackResponse({
        url: jhApis({ source }).map.allMaps,
      });

      if (!allMapsResponse.ok) {
        throw new Error(`HTTP error! status: ${allMapsResponse.status}`);
      }

      const allMapsData = await decodeAsyncData(allMapsResponse);
      const availableMaps = allMapsData;

      // Process maps to handle multiple routes/endings using the 'ender' field
      const processedMaps = availableMaps.map((map) => {
        const hasMultipleRoutes = map.Ender && map.Ender !== null;

        return {
          ...map,
          DisplayName: `${map.Name}${hasMultipleRoutes ? ` (${map.Ender})` : ""}`,
        };
      });

      const totalAvailableMaps = processedMaps.length;
      const completedMapsCount = playerCompletedMaps.size;
      const completionRate =
        totalAvailableMaps > 0
          ? ((completedMapsCount / totalAvailableMaps) * 100).toFixed(2)
          : 0;

      // Create detailed completion data
      const completionDetails = processedMaps.map(
        ({
          DisplayName,
          Name,
          Difficulty,
          IndividualFinishCount,
          ID,
          CpID,
          Author,
          Released,
          Type,
        }) => {
          let individualFinishCount = IndividualFinishCount || 0;

          // If still 0, try to calculate from difficulty data
          if (individualFinishCount === 0 && Difficulty) {
            const totalTops = Object.values(Difficulty).reduce(
              (sum, { NBTops }) => sum + (NBTops || 0),
              0,
            );
            individualFinishCount = totalTops;
          }

          if (individualFinishCount === 0) {
            individualFinishCount = 1; // Default to 1 if no data available
          }

          return {
            MapID: ID,
            DisplayName,
            MapName: Name,
            CpID,
            Author,
            Released,
            Type,
            Difficulty: Difficulty?.["125"]?.Difficulty || 0,
            IsCompleted: playerCompletedMaps.has(DisplayName),
            PlayerDetails: playerMapDetails[DisplayName] || null,
            IndividualFinishCount: individualFinishCount,
          };
        },
      );

      const completedMaps = [];
      const notCompletedMaps = [];

      completionDetails.forEach((map) => {
        if (map.IsCompleted) {
          completedMaps.push(map);
        } else {
          notCompletedMaps.push(map);
        }
      });

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
        playerId,
      });

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
  },
);
