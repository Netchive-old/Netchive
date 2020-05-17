
export interface FFMpegProgressInterface {
  timemark: string;
  percent: number;
  currentFps: number;
  targetSize: number;
  currentKbps: number;
}
