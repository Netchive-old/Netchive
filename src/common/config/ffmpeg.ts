export interface FFMpegConfigInterface {
  outputFile: string;
  gpus?: FFMpegGPUSettingInterface[];
  conversion?: FFMpegMediaConversionInterface;
}

export interface FFMpegGPUSettingInterface {
  id: number;
  maxRenderCount: number;
}

export interface FFMpegMediaConversionInterface {
  accelerator?: string;
  input?: {
    accelerator?: string;
    bufferSeconds?: number;
    codecs?: {
      audioCodec: string;
      videoCodec: string;
    };
    option: string;
  };
  output?: {
    bitrate?: {
      video?: number;
      audio?: number;
    };
    accelerator?: string;
    codecs?: {
      audioCodec: string;
      videoCodec: string;
    };
    option: string;
  };
}
