import fs from "fs";
import Twitch, { HelixUser } from "twitch";
import { StreamerInterface } from "./interface";
import { getTwitchConfig } from "../../config/twitch";

const streamerFile = "./streamer.json";

/**
 * 스트리머 정보를 읽어오는 로더 함수
 */
export function loadStreamerFile(): StreamerInterface[] {
  return JSON.parse(fs.readFileSync(streamerFile, {encoding: "utf-8"}));
}

/**
 * 스트리머 정보를 저장하는 함수 - 기존에 존재하던 것에 덮어씁니다.
 * @param streamers 저장할 스트리머 정보
 */
export function saveStreamerFile(streamers: StreamerInterface[]): void {
  fs.writeFileSync(streamerFile, JSON.stringify(streamers, null, 2), {encoding: "utf-8"});
}

/**
 * 저장된 스트리머 정보를 읽어 내부에서 사용되는 `Twitch.HelixUser` 포맷으로 변경해 줍니다.
 * @param streamer 저장할때 사용한 `StreamerInterface` 데이터
 */
export async function loadStreamer(streamer: StreamerInterface): Promise<HelixUser | null> {
  const twitchConfig = getTwitchConfig();
  const twitchClient = Twitch.withClientCredentials(
    twitchConfig.oAuth.clientId,
    twitchConfig.oAuth.clientSecret
  );

  let loadedStreamer = null;

  if (streamer.id) {
    loadedStreamer = await twitchClient.helix.users.getUserById(streamer.id);
  } else if (streamer.userName) {
    loadedStreamer = await twitchClient.helix.users.getUserByName(streamer.userName);
  }

  return loadedStreamer;
}

/**
 * 스트리머 파일에 있는 모든 스트리머에 대해 데이터를 갱신합니다.
 * 데이터가 존재하지 않는 경우, 데이터를 갱신 하지 않습니다.
 */
export async function updateStreamer(): Promise<void> {
  const streamers = loadStreamerFile();

  for (const streamer of streamers) {
    // eslint-disable-next-line no-await-in-loop
    const streamerData = await loadStreamer(streamer);

    if (streamerData) {
      streamer.id = streamerData.id;
      streamer.userName = streamerData.name;
      
      if (!streamer.metadata) { streamer.metadata = {}; }
      streamer.metadata.description = streamerData.description;
      streamer.metadata.displayName = streamerData.displayName;
      streamer.metadata.isPartner = streamerData.broadcasterType === "partner"
      streamer.metadata.views = streamerData.views;
    }
  }

  saveStreamerFile(streamers);
}
