export interface IMxmUrl {
  type: EMxmUrlType; // Musixmatch's URL type (e.g. EMxmUrlType.ALBUM_TRACKS)
  id?: string; // Musixmatch's ID (e.g. '12345678')
  vanityId?: string; // Musixmatch's vanity ID (e.g. 'Mingturn/BLUE-EP')
  isrc?: string; // ISRC (e.g. 'KRB472400847')
  url?: string; // Musixmatch's URL (e.g. 'https://www.musixmatch.com/album/Mingturn/BLUE-EP')
}

export enum EMxmUrlType {
  ALBUM = 'album',
  ALBUM_TRACKS = 'album.tracks',
  TRACK = 'track',
}
