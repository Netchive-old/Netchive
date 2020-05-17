import { updateStreamer, loadStreamerFile, loadStreamer } from "./common/streamer";
import { loadPlugin, onInit, onRecordStarted, onRecordProgress, onRecordEnded, onRecordError } from "./common/plugins";
import GoogleDrivePlugin from "./plugins/google-drive";
import { setupVideosPath } from "./common/setup";
import { addStreamer } from "./common/twitch/streamer";
import { showBanner } from "./common/util/terminal";
import { addStreamSession } from "./common/streamSession";
import { runFFmpeg, finalizeFFmpeg } from "./common/ffmpeg";
import SamplePlugin from "./plugins/sample";
import { wait } from "./common/util";

showBanner(true, true, true);

// core setup
const videoDir = setupVideosPath();

// Plugin Load Sections
loadPlugin(new SamplePlugin());
loadPlugin(new GoogleDrivePlugin());

(async () => {
  console.log("[Streamer] Updating Streamer...");
  await updateStreamer();

  console.log("[ Plugin ] Initializing Plugins...");
  await onInit();
  
  const streamersFromFile = await loadStreamerFile();

  for (const streamerFromFile of streamersFromFile) {
    const streamer = await loadStreamer(streamerFromFile);
    if (streamer) {
      addStreamer(streamer);

      const stream = await streamer.getStream();
      if (stream) {
        const streamSession = await addStreamSession(videoDir, streamer);
        if (streamSession) {
          onRecordStarted(streamSession);
          runFFmpeg(streamSession.conversion, (progress) => {
            onRecordProgress(streamSession, progress);
          }).then(() => {
            onRecordEnded(streamSession);
          }, (e) => {
            onRecordError(streamSession, e);
          });

          //await wait(20);
          //finalizeFFmpeg(streamSession.conversion);
        }
      } else {
        console.log("[ Stream ] "+streamer.name+" is not online.");
      }
    }
  }
  console.log();
  
})();

