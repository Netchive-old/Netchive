import path from "path";
import { HelixUser } from "twitch";
import { getStreamOnlyClientId, getTwitchAccessToken, getTwitchLivePlaylistUrl, generateDateName } from "../twitch/stream";
import { StreamSessionInterface } from "./interface";
import { loadConfig4FFmpeg, loadFFmpegConfig } from "../ffmpeg/config";
import { allocateGPU } from "./gpu";
import { setupStreamerPath } from "../setup";
import fs from "fs";

const streamSessions: StreamSessionInterface[] = [];
let currentStreamSessionId = 0;

export function getStreamSessions() {
  return streamSessions;
}

export async function addStreamSession(videosDir: string, streamer: HelixUser): Promise<StreamSessionInterface | null> {

  const username = streamer.name;

  const clientId = await getStreamOnlyClientId(username);
  if (!clientId) return null;

  const accessToken = await getTwitchAccessToken(username, clientId);
  if (!accessToken) return null;

  const playlistUrl = await getTwitchLivePlaylistUrl(username, accessToken);
  if (!playlistUrl) return null;

  const ffmpegConfig = loadFFmpegConfig();

  const streamerDir = setupStreamerPath(streamer, videosDir);
  const outputDir = path.join(streamerDir, generateDateName());
  const outputPath = path.join(outputDir, ffmpegConfig.outputFile);

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const isGPULoadBalancingEnabled = ffmpegConfig.gpus && ffmpegConfig.gpus.length > 0;
  console.log("[   GPU  ] GPU Load Balancing", (isGPULoadBalancingEnabled) ? "Enabled":"Disabled");
  
  const allocatedGPU = (isGPULoadBalancingEnabled) ? allocateGPU(currentStreamSessionId) : undefined
  const ffmpegConversion 
    = loadConfig4FFmpeg(playlistUrl, outputPath, ffmpegConfig.conversion, allocatedGPU);

  const streamSession: StreamSessionInterface = {
    id: currentStreamSessionId++,
    gpu: (allocatedGPU) ? {
      id: allocatedGPU
    } : undefined,
    streamer,
    conversion: ffmpegConversion,
    output: {
      outputDir,
      outputPath
    }
  };

  streamSessions.push(streamSession);

  return streamSession;
}

export function removeStreamSession(streamSession: StreamSessionInterface): void {
  return removeStreamSessionById(streamSession.id);
}

export function removeStreamSessionById(id: number): void {
  for (let i = 0; i < streamSessions.length; i++) {
    if (id === streamSessions[i].id) {
      streamSessions.splice(i, 1);
      return;
    }
  }
  return;
}