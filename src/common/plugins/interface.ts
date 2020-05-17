import { HelixUser } from "twitch";
import { FFMpegProgressInterface } from "../record/ffmpeg/interface";
import { StreamSessionInterface } from "../record/streamSession/interface";

interface PluginPrototype {
  /**
   * Netchive Plugin의 고유한 아이디를 담습니다.
   * 겹치면 안됩니다.
   */
  id: string;

  /**
   * Netchive Plugin의 이름을 담습니다.
   */
  name: string;

  /** 
   * Netchive 시스템이 처음 시작 되었을 때 플러그인에서 구동 해야 하는 내용을 담습니다.
   */
  onInit?: () => Promise<void>;

  /**
   * Netchive 시스템이 종료될 때 플러그인에서 구동해야 하는 내용을 담습니다.
   */
  onShutdown?: () => Promise<void>;

  /**
   * Netchive 시스템에서 녹화가 시작되었을 때 구동해야 하는 내용을 담습니다.
   * @param streamSession 현재 스트림세션 정보를 담습니다.
   */
  onRecordStarted?: (streamSession: StreamSessionInterface) => Promise<void>;

  /**
   * Netchive 시스템에서 녹화가 진행 중일 때 구동해야 하는 내용을 담습니다.
   * @param streamSession 현재 스트림세션 정보를 담습니다.
   * @param progress 현재 ffmpeg 처리 정보를 받습니다.
   */
  onRecordProgress?: (streamSession: StreamSessionInterface, progress: FFMpegProgressInterface) => Promise<void>;
  
  /**
   * Netchive 시스템에서 녹화 중 오류가 발생했을 때 구동해야 하는 내용을 담습니다.
   * 
   * @param error 전달할 에러 정보가 이곳으로 전달 됩니다. `undefined` 일 수 있습니다.
   */
  onRecordError?: (streamSession: StreamSessionInterface, error?: any) => Promise<void>;

  /**
   * Netchive 시스템에서 녹화가 완료된 후에 구동해야 하는 내용을 담습니다.
   * @param streamSession 현재 스트림세션 정보를 담습니다.
   */
  onRecordEnded?: (streamSession: StreamSessionInterface) => Promise<void>;

  /**
   * Netchive 시스템에서 스트리머가 추가 되면 구동해야 하는 내용을 담습니다.
   * @param `HelixUser` format의 트위치 스트리머 정보
   */
  onStreamerAdded?: (streamer: HelixUser) => Promise<void>;

  /**
   * Netchive 시스템에서 스트리머가 제거 되면 구동해야 하는 내용을 담습니다.
   * @param `HelixUser` format의 트위치 스트리머 정보
   */
  onStreamerRemoved?: (streamer: HelixUser) => Promise<void>;
}

export default PluginPrototype;