import PluginPrototype from "../../common/plugins/interface";
import { HelixUser } from "twitch";
import { StreamSessionInterface } from "../../common/record/streamSession/interface";
import { FFMpegProgressInterface } from "../../common/record/ffmpeg/interface";

class SamplePlugin implements PluginPrototype {
  public id = "com.netchive.plugin.sample";
  public name = "샘플 플러그인";
  public activated = false;

  public async onInit(): Promise<void> {
    console.log("[샘플플긴] 플러그인 "+this.name+" 시작 중");
    this.activated = true;
  }

  public async onShutdown(): Promise<void> {
    console.log("[샘플플긴] 플러그인 "+this.name+" 종료 중");
    this.activated = false;
    console.log("[샘플플긴] 플러그인 "+this.name+" 종료 완료");
  }

  public async onExit(): Promise<void> {
    console.log("[샘플플긴] 플러그인 "+this.name+" 엔진 종료 준비 중");
  }

  public async onStreamerAdded(streamer: HelixUser): Promise<void> {
    console.log("[샘플플긴] 스트리머 "+streamer.name+" 추가 됨.");
  }

  public async onStreamerRemoved(streamer: HelixUser): Promise<void> {
    console.log("[샘플플긴] 스트리머 "+streamer.name+" 삭제 됨.");
  }

  public async onRecordStarted(streamSession: StreamSessionInterface) {
    console.log("[샘플플긴] 스트리밍 세션 #"+streamSession.id+" "+streamSession.streamer.displayName+" 녹화 시작 됨");
  }

  public async onRecordEnded(streamSession: StreamSessionInterface) {
    console.log("[샘플플긴] 스트리밍 세션 #"+streamSession.id+" "+streamSession.streamer.displayName+" 녹화 완료 됨");
  }

  public async onRecordProgress(streamSession: StreamSessionInterface, progress: FFMpegProgressInterface) {
    console.log("[샘플플긴] 스트리밍 세션 #"+streamSession.id+" "+streamSession.streamer.displayName+" 녹화 중 @ "+progress.timemark+" "+progress.currentFps+"fps");
  }

  public async onRecordError(streamSession: StreamSessionInterface, error?: any) {
    console.log("[샘플플긴] 스트리밍 세션 #"+streamSession.id+" "+streamSession.streamer.displayName+" 녹화 중 오류 발생: "+error);
  }

}

export default SamplePlugin;