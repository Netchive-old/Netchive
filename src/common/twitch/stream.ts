import axios from "axios";
import { getTwitchConfig } from "../config/twitch";
import { TwitchAccessTokenInterface } from "./interface";
import { wait } from "../util";

/**
 * 스트리밍용으로 사용가능한 Client ID를 트위치 공홈을 통해 받습니다.  
 * 정규 표현식으로 빌런짓 해놓은거라 느림.  
 * 
 * 트위치 방송보는 페이지에서 `"Client-ID":"djskfjsdklfjdsklf"` 검색해서 오는 것이기 때문에  
 * 문제생기면 이 로직부터 뜯어야 함.  
 *   
 * 그리고 트위치에서 주기적으로 Client ID 를 쳐 바꾸므로 주의!!  
 * 
 * @param userName 한번 클라이언트 아이디 발급받으면 쭉 간다는 것을 몰라서 만들었던 거, 안 적으면 Default는 트위치 공계
 * @returns 클라이언트 아이디를 던지거나 null 뱉음
 */
export async function getStreamOnlyClientId(userName?: string): Promise<string|null> {
  if (typeof userName === "undefined") userName = "twitch";
  
  const res = await axios.get("https://twitch.tv/"+userName, {
    headers: {
      "User-Agent": getTwitchConfig().userAgent,
    }
  });
  
  const clientIdParser = /"Client-ID":"([A-Za-z0-9_-]+)"/g
  const parsedClientId = clientIdParser.exec(res.data);

  if (parsedClientId) {
    return parsedClientId[1];
  } else {
    return null;
  }
}

/**
 * 스트리밍용으로 playlist m3u8 파일을 발급받기 위한 
 * `access_token` 을 발급 받습니다.  
 * 
 * @param userName 사용자 이름
 * @param clientId 클라이언트 ID (Default. `getStreamOnlyClientId` 로 자동 발급)
 * @returns `TwitchAccessTokenInterface` 형식의 토큰 정보로 리턴
 */
export async function getTwitchAccessToken(userName: string, clientIdRaw?: string|null): Promise<TwitchAccessTokenInterface> {
  let clientId;

  if (typeof clientIdRaw === "undefined" || clientIdRaw === null) {
    clientId = await getStreamOnlyClientId(userName);
  } else {
    clientId = clientIdRaw;
  }

  while (typeof clientId === "undefined" || clientId === null) {
    console.error("오류: Client ID가 정상적으로 발급되지 않았습니다! 5초 후 재발급을 시도 합니다.");
    
    // eslint-disable-next-line no-await-in-loop
    await wait(5);

    // eslint-disable-next-line no-await-in-loop
    clientId = await getStreamOnlyClientId(userName);
  }
  

  let url = "https://api.twitch.tv/api/channels/"
  url += userName+"/";
  url += "access_token";

  // 트위치는 처음이예여~ 뀨!
  url += "?oauth_token=undefined";

  url += "&need_https=true";
  url += "&platform=web";
  url += "&player_type=site";
  url += "&player_backend=mediaplayer";

  const res = await axios.get(url, {
    headers: {
      "Client-ID": clientId,
      "User-Agent": getTwitchConfig().userAgent,
    }
  }).catch((err) => {
    console.error("오류: ", err);
    return;
  });

  if (typeof res !== "undefined") {
    if (res.status !== 200) {
      throw new Error("Unable to get Channel \""+userName+"\"'s AccessToken");
    }
  
    return res.data as TwitchAccessTokenInterface;
  } else {
    // WE ARE FUCKED.
    return null as unknown as TwitchAccessTokenInterface;
  }
}

/**
 * 트위치 라이브 플레이 리스트의 주소를 가져옵니다
 * 
 * @param userName 사용자
 * @param accessToken `TwitchAccessTokenInterface` 형식의 access_token (Default. `getTwitchAccessToken` 으로 자동 생성함)
 */
export async function getTwitchLivePlaylistUrl(userName: string, accessToken?: TwitchAccessTokenInterface|null): Promise<string> {
  if (typeof accessToken === "undefined" || accessToken === null) {
    accessToken = await getTwitchAccessToken(userName);
  }

  let url = "https://usher.ttvnw.net/";
  url += "api/channel/hls/";
  url += userName+".m3u8";
  
  url += "?allow_source=true";
  url += "&playlist_include_framerate=true";
  url += "&player_backend=mediaplayer";
  url += "&fast_bread=true";
  url += "&reassignments_supported=true";
  url += "&sig="+accessToken.sig;
  url += "&supported_codecs=avc1";
  url += "&token="+encodeURIComponent(accessToken.token);
  url += "&cdm=wv";
  url += "&player_version=0.9.5";

  return url;
}

/**
 * 트위치 라이브 플레이 리스트의 내용을 가져옵니다
 * 
 * @param userName 사용자
 * @param accessToken `TwitchAccessTokenInterface` 형식의 access_token (Default. `getTwitchAccessToken` 으로 자동 생성함)
 */
export async function getTwitchLivePlaylist(userName: string, accessToken?: TwitchAccessTokenInterface|null): Promise<string> {
  const url = await getTwitchLivePlaylistUrl(userName, accessToken as TwitchAccessTokenInterface);

  const res = await axios.get(url, {
    headers: {
      "User-Agent": getTwitchConfig().userAgent,
    }
  });

  return res.data;
}

/**
 * 지정한 날짜에 대해 YYYY-MM-DD_HH-MM-SS 형태로 이름을 생성하여 리턴합니다
 * 
 * @param specifiedDate 지정되지 않은 경우, 현재 시각으로 설정됩니다.
 */
export function generateDateName(specifiedDate?: Date): string {
  const date = (specifiedDate === undefined) ? new Date() : specifiedDate;

  const dateDirName = date.getFullYear()
  +"-"+(date.getMonth()+1).toString().padStart(2, '0')
  +"-"+(date.getDate()).toString().padStart(2, '0')
  +"_"+(date.getHours()).toString().padStart(2, '0')
  +"-"+(date.getMinutes()).toString().padStart(2, '0')
  +"-"+(date.getSeconds()).toString().padStart(2, '0');

  return dateDirName;
}
