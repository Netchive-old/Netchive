import path from "path";
import { HelixUser, HelixStream } from "twitch";
import { getStreamOnlyClientId, getTwitchAccessToken, getTwitchLivePlaylistUrl, generateDateName } from "../../twitch/stream";
import { StreamSessionInterface } from "./interface";
import { loadConfig4FFmpeg, loadFFmpegConfig } from "../ffmpeg/config";
import { allocateGPU } from "./gpu";
import { setupStreamerPath } from "../../setup";
import fs from "fs";

const streamSessions: StreamSessionInterface[] = [];
let currentStreamSessionId = 0;

/**
 * 현재 스트림 세션들을 봅니다.
 */
export function getStreamSessions() {
  return streamSessions;
}

/**
 * 스트림세션을 추가합니다. 자동으로 `getStreamSessions` 에서 접근 할 수 있도록 등록됩니다.
 * 
 * @param videosDir 비디오를 저장할 디렉토리를 지정합니다 `./videos/`
 * @param streamer 스트리머를 `HelixUser` 형으로 전달 받습니다.
 */
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
  console.log("[엔당가속] GPU 로드 밸런싱", (isGPULoadBalancingEnabled) ? "활성화":"비활성화");
  
  const allocatedGPU = (isGPULoadBalancingEnabled) ? allocateGPU(currentStreamSessionId) : undefined
  const ffmpegConversion 
    = loadConfig4FFmpeg(playlistUrl, outputPath, ffmpegConfig.conversion, allocatedGPU);

  const streamSession: StreamSessionInterface = {
    id: currentStreamSessionId++,
    gpu: (allocatedGPU) ? {
      id: allocatedGPU
    } : undefined,
    streamer,
    stream: await streamer.getStream() as HelixStream,
    conversion: ffmpegConversion,
    output: {
      outputDir,
      outputPath
    }
  };

  streamSessions.push(streamSession);

  return streamSession;
}

/**
 * 스트림세션을 제거합니다.
 * @param streamSession 스트림세션
 */
export function removeStreamSession(streamSession: StreamSessionInterface): void {
  return removeStreamSessionById(streamSession.id);
}

/**
 * 스트림세션을 아이디로 제거합니다.
 * @param id 스트림세션의 아이디
 */
export function removeStreamSessionById(id: number): void {
  for (let i = 0; i < streamSessions.length; i++) {
    if (id === streamSessions[i].id) {
      streamSessions.splice(i, 1);
      return;
    }
  }
  return;
}