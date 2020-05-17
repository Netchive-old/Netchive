import { updateStreamer, loadStreamerFile, loadStreamer } from "./common/record/streamer";
import { loadPlugin, onInit, onRecordStarted, onRecordProgress, onRecordEnded, onRecordError, onShutdown } from "./common/plugins";
import GoogleDrivePlugin from "./plugins/google-drive";
import { setupVideosPath } from "./common/setup";
import { addStreamer } from "./common/twitch/streamer";
import { showBanner } from "./common/util/terminal";
import { addStreamSession, getStreamSessions } from "./common/record/streamSession";
import { runFFmpeg, finalizeFFmpeg } from "./common/record/ffmpeg";
import SamplePlugin from "./plugins/sample";

showBanner(true, true, true);

// core setup
const videoDir = setupVideosPath();

// Plugin Load Sections
loadPlugin(new SamplePlugin());

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
            if (/Exiting normally/.test(e)) {
              onRecordEnded(streamSession);
            } else {
              onRecordError(streamSession, e);
            }
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

process.on("SIGINT", () => {
  for (const streamSession of getStreamSessions()) {
    finalizeFFmpeg(streamSession.conversion);
  }

  console.log("[ SIGINT ] Finalization Complete!");

  (async () => {
    onShutdown();
    console.log("[ SIGINT ] Plugin shutdown Complete!");
  });
  


})



