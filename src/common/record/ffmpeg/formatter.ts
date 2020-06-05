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


const timeStampRegex = /([0-9]){2,}:([0-9]{2}):([0-9]{2}).([0-9]{2})/g;

/**
 * ffmpeg의 timeStamp를 UNIX Epoch Style로 변환합니다
 * 
 * @param timeStamp `00:00:00.00` 형태의 타임 스탬프
 */
export function timeStamp2epoch(timeStamp: string): number {
  timeStamp = timeStamp.normalize("NFC");

  const parsed = timeStampRegex.exec(timeStamp);
  
  // reset regular expression: 
  // https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically/21123303
  timeStampRegex.lastIndex = 0;

  if (parsed !== null) {
    const hour = parseInt(parsed[1], 10);
    const min = parseInt(parsed[2], 10);
    const sec = parseInt(parsed[3], 10);
    const decimalPoint = parseInt(parsed[4], 10);

    let result = sec;
    result += min * 60;
    result += hour * 60 * 60;
    result += decimalPoint * 0.01;

    return result;
  } else {
    return -1;
  }
}

/**
 * UNIX Epoch Style timeStamp를 ffmpeg timeStamp로 변환합니다
 * 
 * @param epoch 숫자 형식의 UNIX Epoch Style timeStamp
 */
export function epoch2timeStamp(epoch: number): string {
  const hour = Math.floor(epoch / 3600);

  const hourString = (hour >= 100) ? hour.toString() : hour.toString().padStart(2,'0');
  const min = Math.floor((epoch / 60) % 60).toString().padStart(2,'0');
  const sec = (epoch % 60).toFixed(2).toString().padStart(5,'0');

  return hourString+":"+min+":"+sec;
}

