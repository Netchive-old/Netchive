import fs from "fs";
import path from "path";
import { HelixUser } from "twitch";

/**
 * 지정된 기반 경로 (정의 되지 않은 경우) 하위에 로그 저장을 위한 로그 디렉토리를 사전 생성합니다.
 * @param baseDir 기반 경로
 */
export function setupLogPath(baseDir?: string): string {
  const basePath = baseDir ? baseDir : process.cwd();

  const logsPath = path.join(basePath, "logs");

  if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath);
  }
  return logsPath;
}

/**
 * 지정된 기반 경로 (정의 되지 않은 경우) 하위에 녹화 데이터 저장을 위한 비디오 디렉토리를 사전 생성합니다.
 * @param baseDir 기반 경로
 */
export function setupVideosPath(baseDir?: string): string {
  const basePath = baseDir ? baseDir : process.cwd();

  const videosPath = path.join(basePath, "videos");

  if (!fs.existsSync(videosPath)) {
    fs.mkdirSync(videosPath);
  }

  const byIdPath = path.join(videosPath, "by-id");
  const byNamePath = path.join(videosPath, "by-name");

  if (!fs.existsSync(byIdPath)) fs.mkdirSync(byIdPath);
  if (!fs.existsSync(byNamePath)) fs.mkdirSync(byNamePath);

  return videosPath;
}

/**
 * 지정된 기반 경로 (정의 되지 않은 경우) 하위에 녹화 데이터 저장을 위한 스트리머 디렉토리를 사전 생성합니다.
 * @param streamer `HelixUser` 형태의 스트리머 정보
 * @param videosDir 비디오 경로
 */
export function setupStreamerPath(streamer: HelixUser, videosDir?: string): string {
  const videosPath = videosDir ? videosDir : setupVideosPath();

  const id = streamer.id;
  const username = streamer.name;

  const byIdStreamerPath = path.join(videosPath, "by-id", id);
  const byNameStreamerPath = path.join(videosPath, "by-name", username);

  if (!fs.existsSync(byIdStreamerPath)) fs.mkdirSync(byIdStreamerPath);
  
  if (fs.existsSync(byNameStreamerPath)) fs.unlinkSync(byNameStreamerPath);
  
  try {
    fs.symlinkSync(byIdStreamerPath, byNameStreamerPath, "dir");
  } catch(e) {
    fs.rmdirSync(byNameStreamerPath);
  }

  return byIdStreamerPath;
}

