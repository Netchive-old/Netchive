import Plugin from "./interface";
import { HelixUser } from "twitch";
import { StreamSessionInterface } from "../record/streamSession/interface";
import { FFMpegProgressInterface } from "../record/ffmpeg/interface";

const loadedPlugins: Plugin[] = [];

/**
 * Netchive plugin format을 로드 합니다.
 * 플러그인은 `onInit` 을 호출하기 이전에 미리 호출되어야 합니다.
 * @param plugin Plugin 정보
 */
export function loadPlugin(plugin: Plugin): void {
  loadedPlugins.push(plugin);
}

/**
 * Netchive plugin 마다 할당된 고유 ID 로 로드된 플러그인을 찾습니다.
 * @param id Plugin ID
 */
export function findPluginById(id: string): Plugin|null {
  for (const plugin of loadedPlugins) {
    if (plugin.id === id) return plugin;
  }
  return null;
}

/**
 * Netchive plugin의 이름으로 로드된 플러그인을 찾습니다. (비권장. `findPluginById` 사용 권장)
 * @param id Plugin 이름
 */
export function findPluginByName(name: string): Plugin|null {
  for (const plugin of loadedPlugins) {
    if (plugin.name === name) return plugin;
  }
  return null;
}

/**
 * 로드된 플러그인의 모든 initialization 스크립트를 구동하도록 합니다.
 */
export async function onInit(): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onInit) await plugin.onInit();
  }
}

/**
 * 로드된 플러그인의 모든 shutdown 스크립트를 구동하도록 합니다.
 */
export async function onShutdown(): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onShutdown) await plugin.onShutdown();
  }
}

/**
 * 로드된 플러그인의 모든 onStreamerAdded 스크립트를 구동하도록 합니다.
 */
export async function onStreamerAdded(streamer: HelixUser): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onStreamerAdded) await plugin.onStreamerAdded(streamer);
  }
}

/**
 * 로드된 플러그인의 모든 onStreamerRemoved 스크립트를 구동하도록 합니다.
 */
export async function onStreamerRemoved(streamer: HelixUser): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onStreamerRemoved) await plugin.onStreamerRemoved(streamer);
  }
}

/**
 * 로드된 플러그인의 모든 onRecordStarted 스크립트를 구동하도록 합니다.
 */
export async function onRecordStarted(streamSession: StreamSessionInterface): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onRecordStarted) await plugin.onRecordStarted(streamSession);
  }
}

/**
 * 로드된 플러그인의 모든 onRecordProgress 스크립트를 구동하도록 합니다.
 */
export async function onRecordProgress(streamSession: StreamSessionInterface, progress: FFMpegProgressInterface): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onRecordProgress) await plugin.onRecordProgress(streamSession, progress);
  }
}

/**
 * 로드된 플러그인의 모든 onRecordEnded 스크립트를 구동하도록 합니다.
 */
export async function onRecordEnded(streamSession: StreamSessionInterface): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onRecordEnded) await plugin.onRecordEnded(streamSession);
  }
}

/**
 * 로드된 플러그인의 모든 onRecordError 스크립트를 구동하도록 합니다.
 */
export async function onRecordError(streamSession: StreamSessionInterface, error?: any): Promise<void> {
  for (const plugin of loadedPlugins) {
    // eslint-disable-next-line no-await-in-loop
    if (plugin.onRecordError) await plugin.onRecordError(streamSession, error);
  }
}


