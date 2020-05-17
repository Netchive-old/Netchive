import { HelixUser } from "twitch";
import { onStreamerAdded } from "../plugins";

const streamers: HelixUser[] = [];

/**
 * 현재 등록된 스트리머 리스트를 가져옵니다.
 */
export function getStreamers(): HelixUser[] {
  return streamers;
}

/**
 * 스트리머를 신규 추가합니다.
 * @param streamer `HelixUser` 형태의 스트리머 정보. `StreamerInterface`의 경우 `loadStreamer` function 을 이용하여 데이터를 우선 변환하여야 함.
 */
export function addStreamer(streamer: HelixUser): void {
  streamers.push(streamer);
  onStreamerAdded(streamer);
}

/**
 * 스트리머를 제거합니다.
 * @param streamer `HelixUser` 형태의 스트리머 정보.
 */
export function removeStreamer(streamer: HelixUser): void {
  const id = streamer.id;

  let index = -1;
  for (const streamer of getStreamers()) {
    if (streamer.id === id) {
      index = streamers.indexOf(streamer);
    }
  }

  if (index >= 0) streamers.splice(index, 1);
}
