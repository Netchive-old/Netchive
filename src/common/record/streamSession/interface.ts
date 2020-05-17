import { FfmpegCommand } from "fluent-ffmpeg";
import { HelixUser } from "twitch";

export interface StreamSessionInterface {
  id: number;
  conversion: FfmpegCommand;
  streamer: HelixUser;
  gpu?: {
    id: number;
  }
  output: {
    outputDir: string;
    outputPath: string;
  }
};