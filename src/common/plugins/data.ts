import PluginPrototype from "../plugins/interface";
import { StreamSessionInterface } from "../record/streamSession/interface";
import { findPluginById } from ".";

export function getPluginSessionData(plugin: PluginPrototype, streamSession: StreamSessionInterface): any {
  return getPluginSessionDataById(plugin.id, streamSession);
}

export function getPluginSessionDataById(pluginId: string, streamSession: StreamSessionInterface): any {
  if (!findPluginById(pluginId)) { return undefined; }
  
  if (streamSession.plugins === undefined) { streamSession.plugins = {}; }
  if (streamSession.plugins[pluginId] === undefined) { streamSession.plugins[pluginId] = {}; }

  return streamSession.plugins[pluginId];
}
