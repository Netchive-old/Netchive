
import { FfmpegCommand } from "fluent-ffmpeg";
import { FFMpegProgressInterface } from "./interface";

/**
 * ffmpegCommand 를 `Promise` 형태로 실행 합니다.
 * @param ffmpeg 실행할 `ffmpegCommand` command 규격입니다.
 * @param progressCallback (옵션) ffmpeg 처리 중 `ffmpegProgress` 정보를 받을 callback을 정의합니다.
 */
export function runFFmpeg(ffmpeg: FfmpegCommand, progressCallback?: (oh: FFMpegProgressInterface) => void): Promise<void> {
  return new Promise<void> (
    (res, rej) => {
      if (typeof progressCallback !== "undefined") {
        ffmpeg.on("progress", (progress) => {
          progressCallback(progress);
        });
      }
      ffmpeg.on("error", (e) => {
        console.error("An error occurred!!!", e);
        rej(e);
      });
      ffmpeg.on("end", () => {
        res();
      });
      ffmpeg.run();
    }
  )
}

/**
 * ffmpegCommand에 종료 요청을 보냅니다.
 * @param ffmpeg 실행할 `ffmpegCommand` command 규격입니다. 
 */
export function finalizeFFmpeg(ffmpeg: FfmpegCommand): void {
  (ffmpeg as unknown as any).ffmpegProc.stdin.write("q\n");
  (ffmpeg as unknown as any).ffmpegProc.stdin.end();
}
