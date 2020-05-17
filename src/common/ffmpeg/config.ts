import { FFMpegMediaConversionInterface, FFMpegConfigInterface } from "../config/ffmpeg";
import * as stream from "stream";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import fs from "fs";

export const ffmpegConfigFile = "./config/core/ffmpeg.json";

/**
 * ffmpeg 설정을 가져옵니다.
 */
export function loadFFmpegConfig(): FFMpegConfigInterface {
  return JSON.parse(fs.readFileSync(ffmpegConfigFile, {encoding: "utf-8"}));
}


/**
 * ffmpeg 변환 설정을 가져옵니다.
 */
export function loadFFmpegConversionConfig(): FFMpegMediaConversionInterface | undefined {
  return loadFFmpegConfig()?.conversion;
}

/**
 * ffmpeg 오브젝트를 Config에 맞춰 생성 해 줍니다.
 * 
 * @param input 입력 파일
 * @param output 나가는 파일
 * @param ffmpegConversionConfig ffmpeg가 어떻게 인코딩 해야 하는 지 저장된 object (`config.conversion`) 
 */
export function loadConfig4FFmpeg(input: string | stream.Readable, output: string | stream.Writable, ffmpegConversionConfig?: FFMpegMediaConversionInterface, gpuIndex?: number): FfmpegCommand {
  let extensionParsed = ['mp4'];

  if (typeof output === "string") {
    extensionParsed = output.split('.');
  }

  const extension = extensionParsed[extensionParsed.length - 1];

  const conversion = ffmpeg().addInput(input).addOptions([
    //"-vsync 1",
    "-async 1"
  ]).output(output);


  if (gpuIndex) {
    // https://stackoverflow.com/questions/41948716/how-to-choose-gpu-among-multiple-nvidia-gpu-in-ffmpeg-3-2-0
    const gpuOption = "-gpu "+gpuIndex;
    const gpuCudaVidOption = "-hwaccel_device "+gpuIndex;

    console.debug(`가속: 분산 그래픽 가속 기능이 활성화 되었습니다. ${gpuIndex} 번 그래픽 카드로의 가속을 시작합니다.`);
    conversion.addInputOption(gpuCudaVidOption);
    conversion.addOutputOption(gpuOption);
  }
  
  if (typeof ffmpegConversionConfig?.accelerator !== "undefined") {
    conversion.addOption("-hwaccel "+ffmpegConversionConfig?.accelerator);
  }
  
  if (typeof ffmpegConversionConfig?.input !== "undefined") {
    if (typeof ffmpegConversionConfig?.input.accelerator !== "undefined") {
      conversion.addInputOption("-hwaccel "+ffmpegConversionConfig?.input.accelerator);
    }

    if (typeof ffmpegConversionConfig?.input.codecs !== "undefined") {
      if (typeof ffmpegConversionConfig?.input.codecs.audioCodec !== "undefined") {
        conversion.addInputOption("-c:a "+ffmpegConversionConfig?.input.codecs.audioCodec);
      }

      if (typeof ffmpegConversionConfig?.input.codecs.videoCodec !== "undefined") {
        conversion.addInputOption("-c:v "+ffmpegConversionConfig?.input.codecs.videoCodec);
      }
    }

    if (typeof ffmpegConversionConfig?.input.option !== "undefined") {
      conversion.addInputOption(ffmpegConversionConfig?.input.option);
    }
  }

  if (typeof ffmpegConversionConfig?.output !== "undefined") {

    if (typeof ffmpegConversionConfig?.output.bitrate !== "undefined") {
      if (typeof ffmpegConversionConfig?.output.bitrate.video !== "undefined") {
        conversion.videoBitrate(ffmpegConversionConfig?.output.bitrate.video);
      }
      if (typeof ffmpegConversionConfig?.output.bitrate.audio !== "undefined") {
        conversion.audioBitrate(ffmpegConversionConfig?.output.bitrate.audio);
      }
    } else {
      conversion.addOutputOption("-b:v 6000K");
    }

    if (typeof ffmpegConversionConfig?.output.accelerator !== "undefined") {
      conversion.addOutputOption("-hwaccel "+ffmpegConversionConfig?.output.accelerator);
    }

    if (typeof ffmpegConversionConfig?.output.codecs !== "undefined") {
      if (typeof ffmpegConversionConfig?.output.codecs.audioCodec !== "undefined") {
        conversion.addOutputOption("-c:a "+ffmpegConversionConfig?.output.codecs.audioCodec);
      }

      if (typeof ffmpegConversionConfig?.output.codecs.videoCodec !== "undefined") {
        conversion.addOutputOption("-c:v "+ffmpegConversionConfig?.output.codecs.videoCodec);
      }
    } else {
      conversion.outputFormat(extension);
    }

    if (typeof ffmpegConversionConfig?.output.option !== "undefined") {
      conversion.addInputOption(ffmpegConversionConfig?.output.option);
    }
  }

  return conversion;
}
