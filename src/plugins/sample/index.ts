import PluginPrototype from "../../common/plugins/interface";
import { HelixUser } from "twitch";
import { StreamSessionInterface } from "../../common/record/streamSession/interface";
import { FFMpegProgressInterface } from "../../common/record/ffmpeg/interface";

class SamplePlugin implements PluginPrototype {
  public id = "com.netchive.plugin.sample";
  public name = "Sample Plugin";

  public async onInit(): Promise<void> {
    console.log("[ Sample ] Initializing plugin "+this.name);
  }

  public async onShutdown(): Promise<void> {
    console.log("[ Sample ] Shutting down plugin "+this.name);
  }

  public async onStreamerAdded(streamer: HelixUser): Promise<void> {
    console.log("[ Sample ] Streamer "+streamer.name+" Added.");
  }

  public async onStreamerRemoved(streamer: HelixUser): Promise<void> {
    console.log("[ Sample ] Streamer "+streamer.name+" Removed.");
  }

  public async onRecordStarted(streamSession: StreamSessionInterface) {
    console.log("[ Sample ] StreamSession #"+streamSession.id+" "+streamSession.streamer.displayName+" Started");
  }

  public async onRecordEnded(streamSession: StreamSessionInterface) {
    console.log("[ Sample ] StreamSession #"+streamSession.id+" "+streamSession.streamer.displayName+" Ended");
  }

  public async onRecordProgress(streamSession: StreamSessionInterface, progress: FFMpegProgressInterface) {
    console.log("[ Sample ] StreamSession #"+streamSession.id+" "+streamSession.streamer.displayName+" @ "+progress.timemark);
  }

  public async onRecordError(streamSession: StreamSessionInterface, error?: any) {
    console.log("[ Sample ] StreamSession #"+streamSession.id+" got Error: "+error);
  }

}

export default SamplePlugin;