/**
 * 32541 KB 를 32.54 MB 로 만들어 주는 유틸~~
 * 
 * @param size 사이즈 (킬로바이트)
 */
export function sizeStringFormatter(size: number): string {
  return (
    (size < 1000) ? size.toFixed(2).toString().padStart(6, ' ')+" KB" : (
      ((size / 1000) < 1000) ? 
        (size / 1000).toFixed(2).toString().padStart(6, ' ')+" MB" :
        (size / 1000000).toFixed(2).toString().padStart(6, ' ')+" GB"
    )
  );
}

/**
 * 32541 Kbps 를 32.54 Mbps 로 만들어 주는 유틸~~
 * 
 * @param size 사이즈 (Kbps)
 */
export function speedStringFormatter(currentKbps: number): string {
  return (
    (currentKbps < 10000) ? 
      currentKbps.toFixed(2).toString().padStart(7, ' ')+" Kbps" : (
        ((currentKbps / 1000) < 10000) ? 
          (currentKbps / 1000).toFixed(2).toString().padStart(7, ' ')+" Mbps" :
          (currentKbps / 1000000).toFixed(2).toString().padStart(7, ' ')+" Gbps"
      )
  );
}
