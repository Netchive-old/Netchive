export function wait(sec: number): Promise<void> {
  return new Promise<void> (
    (res) => {
      setTimeout(() => {
        res();
      }, 1000*sec);
    }
  )
}
