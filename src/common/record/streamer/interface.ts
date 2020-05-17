/**
 * 스트리머 정보 저장 규격
 */
export interface StreamerInterface {
  id?: string;
  userName?: string;
  metadata?: StreamerMetadataInterface;
}                                   

/**
 * 스트리머 정보 메타데이터 저장 규격
 */
export interface StreamerMetadataInterface {
  displayName?: string;
  description?: string;
  views?: number;
  isPartner?: boolean;
}

