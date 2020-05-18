**Sorry for English Speakers. One of the Netchive Team Crew is speaking "Ko-ree-ahn He-uh-ro-jeu" instead of English. So, I am unable to provide JSDoc in English. I apologize in advance!**  
**GitHub에 한국어 써서 죄송합니다. 넷카이브 운영진 중에 한명이 영어를 리드미를 읽으라고 하니깐 영어를 "코리안 히어로즈" 밖에 모른다고 해서 코드 내에 주석하고 리드미 모두 전부 한국어로 써져 있습니다.**  

![banner-image](https://user-images.githubusercontent.com/27724108/82224984-85907080-995f-11ea-9859-60ebc3d75120.png)
# 넷카이브
안녕하세요. 확장성이 강화된 트위치 라이브스트림 녹화 시스템 넷카이브입니다.

## 넷카이브 핵심 동작 원리
위에서 말한 그 "코리안 히어로즈" 빌런 때문에 적습니다. ~~덕분에 트위치에서 더 빨리 막겠네요.~~  

작동 방법은 크게 3개로 나뉩니다.  

### Stream 수신용 Client ID 발급
Twitch가 언뜻 봐서는 API를 없앤것 처럼 보이지만. (쿼리 날렸을 때 410 뜸).  
사실은 아니랍니다. 공식 개발자 API 를 통해서 발급 받은 것만 410이 뜨고, 트위치에서 임시로 발급해주는 Client ID 는 API 가 접근이 가능해요.  

그래서 임시로 발급해주는 Client ID를 찾습니다.  
해당 로직은 [src/common/twitch/stream.ts#L18](src/common/twitch/stream.ts#L18) 에 나와있습니다.  

### Stream 수신 용 액세스 토큰 발급
이제 스트림 수신이 가능한 Client ID를 발급 받았으니, access_token을 발급 받을 수 있습니다. (m3u8 파일을 받기 위해 access_token이 필요합니다.)  

접속하는 URL은 다음과 같습니다.  
```
https://api.twitch.tv/api/channels/계정이름/access_token?oauth_token=undefined&platform=web&player_type=site&player_backend=mediaplayer
```
oauth_token을 undefined로 한 이유는, URL 직접 접속을 통한 최초 접속인 것으로 위장하기 위해서입니다. (다른 코드에서 적용되지 않으나 해당 내용을 적용하지 않으면 bad request가 발생했습니다.)  

해당 로직은 [src/common/twitch/stream.ts#L45](src/common/twitch/stream.ts#L45) 에 나와있습니다.  

### m3u8 발급
이제 다른 튜토리얼 처럼 m3u8을 발급 받을 수 있습니다. 다음과 같이 처리 합니다.  

```
https://usher.ttvnw.net/api/channel/hls/계정이름.m3u8
?allow_source=true
&playlist_include_framerate=true
&player_backend=mediaplayer
&fast_bread=true
&reassignments_supported=true
&sig=액세스토큰에서받았던sig
&supported_codefcs=avc1
&token=액세스토큰의토큰을URIEncode한것
&cdm=wv
&player_version=0.9.5
```

fast_bread=true는 720p 이상 스트리밍 받기 위해 필요합니다.  
해당 로직은 [src/common/twitch/stream.ts#L105](src/common/twitch/stream.ts#L105) 에 나와있습니다.  

## GPU 분배 처리
매번 스트리밍세션을 생성할 때 마다 사전에 설정된 그래픽 카드당 최대 렌더 개수를 계산하여 할당 합니다.

해당 로직은 [src/common/record/streamSession/gpu.ts#L27](src/common/record/streamSession/gpu.ts#L27) 에서 확인 가능합니다.

## LICENSE
[LICENSE] 파일에 명시된 것과 같이, MIT License입니다.


