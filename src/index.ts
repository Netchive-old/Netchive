import { updateStreamer, loadStreamerFile, loadStreamer } from "./common/streamerFile";
import { loadPlugin, onInit, onRecordStarted, onRecordProgress, onRecordEnded, onRecordError, onShutdown, onExit } from "./common/plugins";
import { setupVideosPath } from "./common/setup";
import { addStreamer } from "./common/twitch/streamer";
import { showBanner } from "./common/util/terminal";
import { addStreamSession, getStreamSessions, waitForStreamSessionsShutdown } from "./common/record/streamSession";
import { runFFmpeg, finalizeFFmpeg } from "./common/record/ffmpeg";
import SamplePlugin from "./plugins/sample";
import { freeGPU } from "./common/record/streamSession/gpu";
import { timeStamp2epoch } from "./common/record/ffmpeg/formatter";

showBanner(true, true, true);

// video 폴더 설정
const videoDir = setupVideosPath();

// 플러그인 로드
loadPlugin(new SamplePlugin());

(async () => {

  // 스트리머 정보 업데이트
  console.log("[스트리머] 스트리머 정보 갱신 중...");
  await updateStreamer();

  // 플러그인 활성화 및 활성화 훅 처리
  console.log("[플러그인] 플러그인 활성화 중...");
  await onInit();
  
  // 스트리머 파일 불러오기
  const streamersFromFile = await loadStreamerFile();

  // 스트리머 마다 각각
  for (const streamerFromFile of streamersFromFile) {
    const streamer = await loadStreamer(streamerFromFile);

    // 스트리머가 존재하면
    if (streamer) {

      // 스트리머를 Netchive 시스템에 추가.
      addStreamer(streamer);

      // 스트리밍 정보 가져오기
      const stream = await streamer.getStream();

      // 스트림이 존재 하면
      if (stream) {

        // 스트리밍 세션 생성
        const streamSession = await addStreamSession(videoDir, streamer);

        // 세션 생성 성공 했다면
        if (streamSession) {

          // 플러그인에 녹화 시작한걸 알림
          await onRecordStarted(streamSession);

          // ffmpeg 시작
          runFFmpeg(streamSession.conversion, (progress) => {

            // 상황을 저장함.
            streamSession.status.timestamp = progress.timemark;
            streamSession.status.epoch = timeStamp2epoch(progress.timemark);
            streamSession.status.lastUpdate = new Date();

            // 진행 중 정보 플러그인으로 전달
            onRecordProgress(streamSession, progress);

          }).then(async () => {

            // 끝나면 녹화 완료 후작업 돌리고
            await onRecordEnded(streamSession);

            // GPU 할당 해제
            freeGPU(streamSession.id);

          }).catch(async (e) => {

            // 정상 종료 된건지 확인
            if (/Exiting normally/.test(e)) {

              // 녹화 완료 처리
              await onRecordEnded(streamSession);

              // GPU 할당 해제
              freeGPU(streamSession.id);

            } else {

              // 녹화 오류 발생한 경우 녹화 오류로 넘김
              await onRecordError(streamSession, e);

              // GPU 할당 해제
              freeGPU(streamSession.id);

            }

          });
        }
      } else {
        console.log("[스트리머] "+streamer.name+" 가 온라인이 아닙니다.");
      }
    }
  }
})();

const onBeforeExit = async () => {
  console.log("[종료요청] 엔진 종료 처리 중!");
  await onExit();

  process.exit();
};

const onSIGINT = async () => {
  console.log();
  
  for (const streamSession of getStreamSessions()) {
    finalizeFFmpeg(streamSession.conversion);
    console.log("[종료요청] "+streamSession.streamer.name+" ("+streamSession.streamer.displayName+") 녹화 마무리 진행 중");
  }

  console.log("[종료요청] 스트림 완료처리 완료!");

  await onShutdown();
  console.log("[종료요청] 플러그인 종료작업 완료!");
  console.log("[종료요청] 세션 "+getStreamSessions().length+"개 확인 됨!");

  await waitForStreamSessionsShutdown();
  console.log("[종료요청] 세션 종료 완료!");

  console.log("[종료요청] 모든 세션 종료 확인 됨!");
  await onBeforeExit();

  process.exit();
}

process.on("SIGINT", () => {
  let completed = false;
  onSIGINT().then(() => {
    console.log("[종료요청] SIGINT 핸들링 완료!");
    completed = true;
  });

  const startSecond = Date.now();
  let lastSecond = Date.now();
  let showScreen = true;

  while(!completed) {
    showScreen = Date.now() - lastSecond > 1000 ? true : false;
    if (showScreen) {
      console.log("[종료요청] 종료 요청을 대기하는 중 입니다. 현재 "+((lastSecond - startSecond) / 1000).toFixed(2)+" 초 대기 중...");
      lastSecond = Date.now();
    }
  }
});

process.on("beforeExit", () => {
  let completed = false;
  onBeforeExit().then(() => {
    console.log("[종료요청] Exit 이전 시도 핸들링 완료!");
    completed = true;
  });

  const startSecond = Date.now();
  let lastSecond = Date.now();
  let showScreen = true;

  while(!completed) {
    showScreen = lastSecond - Date.now() > 1000 ? true : false;
    if (showScreen) {
      console.log("[종료요청] 종료 요청을 대기하는 중 입니다. 현재 "+(lastSecond - startSecond).toFixed(2)+"초 대기 중...");
      lastSecond = Date.now();
    }
  }
});


