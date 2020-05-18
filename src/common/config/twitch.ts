import fs from "fs";

interface TwitchConfig {
  oAuth: {
    clientId: string;
    clientSecret: string;
  };
  userAgent: string;
}

/**
 * 트위치 컨피그를 불러옵니다.  
 * `config/core/twitch.json`
 */
export function getTwitchConfig(): TwitchConfig {
  return JSON.parse(fs.readFileSync("config/core/twitch.json", {encoding: "utf-8"}));
}
