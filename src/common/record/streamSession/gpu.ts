import { loadFFmpegConfig } from "../ffmpeg/config";

interface FFmpegGPUAllocationInterface {
  id: number;
  maxRenderCount: number;
  render: number[];
}

export const gpuList: FFmpegGPUAllocationInterface[] = [];

const ffmpegConfig = loadFFmpegConfig();
if (ffmpegConfig.gpus) {
  for (const gpu of ffmpegConfig.gpus) {
    gpuList.push({
      id: gpu.id,
      maxRenderCount: gpu.maxRenderCount,
      render: []
    })
  }
}

export function allocateGPU(streamSessionId: number) {
  let mostLessGPUId = gpuList[0].id;
  let mostLessGPURenderCount = gpuList[0].render.length;
  for (const gpu of gpuList) {
    const isGPUReachedLimit = gpu.maxRenderCount >= gpu.render.length;
    if (isGPUReachedLimit) { continue; }

    if (gpu.render.length < mostLessGPURenderCount)  {
      mostLessGPUId = gpu.id;
      mostLessGPURenderCount = gpu.render.length;
    }
  }

  if (mostLessGPUId === gpuList[0].id) {
    if (gpuList[0].render.length === gpuList[0].maxRenderCount) {
      throw new Error("Out of GPUs");
    }
  }

  for (const gpu of gpuList) {
    if (gpu.id === mostLessGPUId) {
      gpu.render.push(streamSessionId);
      break;
    }
  }

  return mostLessGPUId;
}

export function freeGPU(streamSessionId: number) {
  for (const gpu of gpuList) {
    for (let i = 0; i < gpu.render.length; i++) {
      if (gpu.render[i] === streamSessionId) {
        gpu.render.splice(i, 1);
        return;
      }
    }
  }
}
