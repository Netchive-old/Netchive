import fs from "fs";

interface TwitchConfig {
  oAuth: {
    clientId: string;
    clientSecret: string;
  };
  userAgent: string;
}

export function getTwitchConfig(): TwitchConfig {
  return JSON.parse(fs.readFileSync("config/core/twitch.json", {encoding: "utf-8"}));
}
