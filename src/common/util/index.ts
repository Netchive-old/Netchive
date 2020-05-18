/**
 * 지정된 초 만큼 기다리는 Promise를 리턴합니다.
 * @param sec 기다릴 초
 */
export function wait(sec: number): Promise<void> {
  return new Promise<void> (
    (res) => {
      setTimeout(() => {
        res();
      }, 1000*sec);
    }
  )
}
