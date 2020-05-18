import fs from "fs";
import Twitch from "twitch";
import { getTwitchConfig } from "../config/twitch";
import { StreamerInterface } from "./interface";
import { askQuestion } from "../util/terminal";

const streamerFile = "./streamer.json";

if (!fs.existsSync(streamerFile)) {

  fs.writeFileSync(streamerFile, "[]", {encoding: "utf-8"});
}

const twitchCredentials = getTwitchConfig();
const streamersConfig: StreamerInterface[] = JSON.parse(fs.readFileSync(streamerFile, {encoding: "utf-8"}));

const twitchClient = Twitch.withClientCredentials(
  twitchCredentials.oAuth.clientId,
  twitchCredentials.oAuth.clientSecret
);

(async (): Promise<void> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.debug("====================");

    console.debug("스트리머 리스트:");

    // get max length of id
    let maxIdLength = 0;
    for (const streamer of streamersConfig) {
      maxIdLength = streamer.id && streamer.id.length > maxIdLength ? streamer.id.length : maxIdLength;
    }

    for (const streamer of streamersConfig) {
      const streamerId = streamer.id ? streamer.id : "?";
      const streamerUserName = streamer.userName ? streamer.userName : "?";

      console.debug(`${streamerId.padStart(maxIdLength)}. ${streamerUserName} (${streamer.metadata?.displayName})`);
    }
    console.debug();

    console.debug("1. 추가 / 2. 삭제 / 3. 종료");
    // eslint-disable-next-line no-await-in-loop
    const cmd = await askQuestion("실행할 명령을 입력하세요: ");

    let wa, twitchUser;

    switch (cmd) {
    case "1":
      // eslint-disable-next-line no-case-declarations,no-await-in-loop
      wa = await askQuestion("추가할 스트리머를 입력하세요 : ");

      if (wa === "") break;

      // eslint-disable-next-line no-case-declarations,no-await-in-loop
      twitchUser = await twitchClient.helix.users.getUserByName(wa);

      if (twitchUser === null) {
        console.debug(`스트리머 유저이름: ${wa} 를 찾을 수 없습니다.`);
        continue;
      } else {
        console.debug(`${twitchUser.name} (${twitchUser.displayName}) 감지됨!`);
        console.debug("추가를 진행합니다.");

        streamersConfig.push({
          id: twitchUser.id,
          userName: twitchUser.name,
          metadata: {
            displayName: twitchUser.displayName,
            views: twitchUser.views,
            description: twitchUser.description
          }
        });
      }
      break;

    case "2":
      // eslint-disable-next-line no-case-declarations,no-await-in-loop
      wa = await askQuestion("제거할 스트리머를 입력하세요 : ");

      if (wa === "") break;

      for (let i = 0; i < streamersConfig.length; i++) {
        if (streamersConfig[i].userName === wa) {
          streamersConfig.splice(i, 1);
          break;
        }
      }

      console.error("스트리머를 찾을 수 없습니다.");
      break;

    case "3":
      console.debug("장비를 정지합니다.");
      process.exit(0);
      break;
      
    default:
      console.error("올바르지 않은 입력입니다.");
    }

    fs.writeFileSync(streamerFile, JSON.stringify(streamersConfig, null, 2), {encoding: "utf-8"} );
    console.debug("업데이트 완료.");
    console.clear();
  }  
})();