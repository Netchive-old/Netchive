import { FfmpegCommand } from "fluent-ffmpeg";
import { HelixUser, HelixStream } from "twitch";

export interface StreamSessionInterface {
  id: number;
  conversion: FfmpegCommand;
  streamer: HelixUser;
  stream: HelixStream;
  gpu?: {
    id: number;
  };
  output: {
    outputDir: string;
    outputPath: string;
  };
  plugins?: {
    [key: string]: any;
  };
};