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
