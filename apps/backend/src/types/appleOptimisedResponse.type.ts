export interface IAppleOptimisedResponse {
  id: string; // Apple Music's ID (e.g. '1748504606'). Come from `id`
  isrc: string; // ISRC (e.g. 'KRB472400847'). Come from `attributes.isrc`
  name: string; // Song's name (e.g. 'Blue Lemonade'). Come from `attributes.name`
  url: string; // Apple Music's URL (e.g. 'https://music.apple.com/kr/album/blue-lemonade/1748504604?i=1748504606'). Come from `attributes.url`

  trackNumber: number; // Track number (e.g. 2). Come from `attributes.trackNumber`
  discNumber: number; // Disc number (e.g. 1). Come from `attributes.discNumber`

  releaseDate: string; // Release date (e.g. '2024-05-30'). Come from `attributes.releaseDate`
  durationInMillis: number; // Duration in milliseconds (e.g. 208780). Come from `attributes.durationInMillis`

  artwork: {
    url: string; // Artwork URL (e.g. 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/28/84/94/28849458-d7bc-f65a-54a2-076878c32bea/888272134797.jpg/3000x3000bb.jpg'). Come from `attributes.artwork.url` with preprocessed data
  };

  album: {
    id: string; // Album's ID, managed by Apple Music (e.g. '1748504604'). Come from `relationships.album.data.id`
    name: string; // Album's name (e.g. 'Blue - EP'). Come from `attributes.albumName`
  };

  artist: {
    name: string; // Artist's name (e.g. '밍턴'). Come from `attributes.artistName`
  };
}
