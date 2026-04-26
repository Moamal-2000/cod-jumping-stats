import { jhApis } from "@/api/jumpersHeaven";
import { JUMP_FPS } from "@/data/constants";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMapTops = createAsyncThunk(
  "globalSlice/fetchMapTops",
  async (paramsObject) => {
    try {
      const { fps, cpId } = paramsObject;

      if (fps === "all") {
        const promises = JUMP_FPS.map((jumpFps) =>
          fetchMsgPackResponse({
            url: jhApis({ fps: jumpFps, cpId }).map.tops,
          })
            .then((response) => decodeAsyncData(response))
            .then((data) => {
              if (Array.isArray(data)) {
                return data.map((run) => ({
                  ...run,
                  FPS: run?.FPS ?? jumpFps,
                }));
              }
              return [];
            })
            .catch(() => []),
        );

        const results = await Promise.all(promises);

        return results
          .filter((result) => Array.isArray(result))
          .flat()
          .filter(
            (run) =>
              run &&
              typeof run === "object" &&
              run.TimePlayed !== null &&
              run.TimePlayed !== undefined,
          )
          .sort((a, b) => a.TimePlayed - b.TimePlayed)
          .map((run, index, runs) => ({
            ...run,
            Rank: index + 1,
            TotalNr: runs.length,
          }));
      }

      const response = await fetchMsgPackResponse({
        url: jhApis({ fps, cpId }).map.tops,
      });
      const mapTops = (await decodeAsyncData(response)) ?? [];

      return mapTops;
    } catch (error) {
      console.error(error);
    }
  },
);

export const fetchMapPlayers = createAsyncThunk(
  "globalSlice/fetchMapPlayers",
  async (paramsObject) => {
    try {
      const { fps, mapId } = paramsObject;

      if (fps === "All") {
        const promises = JUMP_FPS.map((jumpFps) =>
          fetchMsgPackResponse({
            url: jhApis({ fps: jumpFps, mapid: mapId }).player.playersPlayTime,
          })
            .then((response) => decodeAsyncData(response))
            .then((data) => {
              if (Array.isArray(data)) {
                return data.map((player) => ({
                  ...player,
                  FPS: player?.FPS ?? jumpFps,
                }));
              }
              return [];
            })
            .catch(() => []),
        );

        const results = await Promise.all(promises);
        const combinedData = results
          .filter((result) => Array.isArray(result))
          .flat()
          .filter(
            (player) =>
              player &&
              typeof player === "object" &&
              player.PlayerID &&
              player.TimePlayed !== null &&
              player.TimePlayed !== undefined,
          );

        const playerMap = new Map();
        combinedData.forEach((player) => {
          const key = player.PlayerID;
          if (playerMap.has(key)) {
            const existingPlayer = playerMap.get(key);
            existingPlayer.TimePlayed += player.TimePlayed;
            if (!existingPlayer.FPSList) {
              existingPlayer.FPSList = [existingPlayer.FPS];
            }
            if (!existingPlayer.FPSList.includes(player.FPS)) {
              existingPlayer.FPSList.push(player.FPS);
            }
          } else {
            playerMap.set(key, {
              ...player,
              FPSList: [player.FPS],
            });
          }
        });

        return Array.from(playerMap.values()).sort(
          (a, b) => b.TimePlayed - a.TimePlayed,
        );
      }

      const resolvedFps = fps === "mix" ? "0" : fps;
      const response = await fetchMsgPackResponse({
        url: jhApis({ fps: resolvedFps, mapid: mapId }).player.playersPlayTime,
      });
      const data = (await decodeAsyncData(response)) ?? [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);
