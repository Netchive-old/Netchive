/**
 * Twitch에서 제공하는 Access Token의 JSON 규격체입니다.
 */
export interface TwitchAccessTokenInterface {
  token: string;
  sig: string;
  mobile_restricted: boolean;
  expires_at: string;
}
