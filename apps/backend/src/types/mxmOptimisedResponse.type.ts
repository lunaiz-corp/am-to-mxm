export interface IMxmTrackOptimisedResponse {
  abstrack: number; // Musixmatch's abstrack ID (e.g. '179083630'). Come from `commontrack_id`
  isrc: string; // ISRC (e.g. 'KRB472400847'). Come from `track_isrc` - Temporarily get this from parameter not from response
  name: string; // Song's name (e.g. 'Blue Lemonade'). Come from `track_name`

  url: string; // Musixmatch's URL (e.g. 'https://www.musixmatch.com/lyrics/Mingturn/Blue-Lemonade?utm_source=application&utm_campaign=api&utm_medium=musiXmatch+-+internal+use%3A1409607281181'). Come from `track_share_url`
  vanityId?: string; // Musixmatch's Vanity ID (e.g. 'Mingturn/Blue-Lemonade'). Come from `commontrack_vanity_id`

  album: {
    id: number; // Album's ID, managed by Musixmatch (e.g. '65454068'). Come from `album_id`
    name: string; // Album's name (e.g. 'BLUE'). Come from `album_name`
  };

  artist: {
    id: number; // Artist's ID, managed by Musixmatch (e.g. '56495958'). Come from `artist_id`
    name: string; // Artist's name (e.g. 'Mingturn'). Come from `attributes.artistName`
  };
}

export interface IMxmAlbumOptimisedResponse {
  id: number; // Musixmatch's album ID (e.g. '65454068'). Come from `album_id`
  name: string; // Song's name (e.g. 'Blue Lemonade'). Come from `track_name`

  url: string; // Musixmatch's URL (e.g. 'https://www.musixmatch.com/lyrics/Mingturn/Blue-Lemonade?utm_source=application&utm_campaign=api&utm_medium=musiXmatch+-+internal+use%3A1409607281181'). Come from `track_share_url`

  artist: {
    id: number; // Artist's ID, managed by Musixmatch (e.g. '56495958'). Come from `artist_id`
    name: string; // Artist's name (e.g. 'Mingturn'). Come from `attributes.artistName`
  };

  externalIds?: {
    itunes?: number; // Apple Music's ID (e.g. '1748504606'). Come from `external_ids.itunes[0]`
  };
}
