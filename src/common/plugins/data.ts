import PluginPrototype from "../plugins/interface";
import { StreamSessionInterface } from "../record/streamSession/interface";
import { findPluginById } from ".";

/**
 * 플러그인의 세션 정보를 가져옵니다.
 * @param plugin 플러그인 오브젝트
 * @param streamSession 스트림 세션
 */
export function getPluginSessionData(plugin: PluginPrototype, streamSession: StreamSessionInterface): any {
  return getPluginSessionDataById(plugin.id, streamSession);
}

/**
 * 플러그인의 세션 정보를 아이디를 통해 가져옵니다.
 * @param pluginId 플러그인의 고유 아이디
 * @param streamSession 스트림 세션
 */
export function getPluginSessionDataById(pluginId: string, streamSession: StreamSessionInterface): any {
  if (!findPluginById(pluginId)) { return undefined; }
  
  if (streamSession.plugins === undefined) { streamSession.plugins = {}; }
  if (streamSession.plugins[pluginId] === undefined) { streamSession.plugins[pluginId] = {}; }

  return streamSession.plugins[pluginId];
}
