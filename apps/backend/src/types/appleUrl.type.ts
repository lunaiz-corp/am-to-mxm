export interface IAppleMusicUrl {
  id: string; // Apple Music's ID (e.g. '1748504604')
  type: EAppleMusicUrlType; // Apple Music's URL type (e.g. EAppleMusicUrlType.ALBUM)
  storefront: string; // Apple Music's storefront (e.g. 'kr'. ISO 3166-1 alpha-2 country code)
  url: string; // Apple Music's URL (e.g. 'https://music.apple.com/kr/album/blue-ep/1748504604')
}

export enum EAppleMusicUrlType {
  ALBUM = 'albums',
  SONG = 'songs',
}
