import readline from "readline";

/**
 * 넷카이브 제목과 저작권을 표기합니다.
 * 
 * @param showTitle 제목 표시 여부
 * @param showCopyright 저작권 표시 여부
 * @param lineReturn 표기후 엔터 여부
 */
export function showBanner(showTitle?: boolean, showCopyright?: boolean, lineReturn?: boolean): void {
  if (showTitle) console.log("넷카이브™ 시스템");
  if (showCopyright) console.log("Copyright (c) Netchive Team, All rights reserved.");
  if (lineReturn) console.log();
}

/**
 * 터미널로 질문을 물어보고 결과를 반환 받습니다.
 * @param question 질문 이름.
 */
export function askQuestion(question: string): Promise<string> {
  return new Promise<string> (
    (rs) => {
      const rl = readline.createInterface(
        process.stdin,
        process.stdout
      )
      rl.question(question, (answer) => {
        rl.close();
        rs(answer);
      })
    }
  );
}