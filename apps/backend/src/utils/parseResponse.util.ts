import type { IAppleOptimisedResponse } from '../types/appleOptimisedResponse.type';
import { IMxmOptimisedResponse } from '../types/mxmOptimisedResponse.type';

export function parseResponseFromApple(
  data: AppleMusicApi.Album[] | AppleMusicApi.Song[],
): IAppleOptimisedResponse[] {
  return data.flatMap((item) => {
    const { relationships } = item;
    if (!relationships) return [];

    const songUnit =
      'tracks' in relationships
        ? relationships.tracks.data
        : [item as AppleMusicApi.Song];

    const albumUnit =
      'albums' in relationships
        ? relationships.albums.data[0]
        : (item as AppleMusicApi.Album);

    return songUnit.flatMap((song) => {
      return {
        id: song.id,
        isrc: song.attributes!.isrc,
        name: song.attributes!.name,
        url: song.attributes!.url,

        trackNumber: song.attributes!.trackNumber,
        discNumber: song.attributes!.discNumber,

        releaseDate: song.attributes!.releaseDate,
        durationInMillis: song.attributes!.durationInMillis,

        artwork: {
          url: song.attributes!.artwork
            ? song
                .attributes!.artwork.url.replace(
                  '{w}',
                  song.attributes!.artwork.width.toString(),
                )
                .replace('{h}', song.attributes!.artwork.height.toString())
            : '',
        },

        album: {
          id: albumUnit.id,
          name: song.attributes!.albumName,
        },

        artist: {
          name: song.attributes!.artistName,
        },
      };
    });
  });
}

export function parseResponseFromMxm(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  isrc?: string,
): IMxmOptimisedResponse {
  if (data.track) {
    return {
      abstrack: data.track.commontrack_id,
      isrc: data.track.track_isrc || isrc,
      name: data.track.track_name,

      url: data.track.track_share_url,
      vanityId: data.track.commontrack_vanity_id,

      artwork: {
        url: {
          '100x100': data.track.album_coverart_100x100,
          '350x350': data.track.album_coverart_350x350,
          '500x500': data.track.album_coverart_500x500,
          '800x800': data.track.album_coverart_800x800,
        },
      },

      album: {
        id: data.track.album_id,
        name: data.track.album_name,
        vanityId: data.track.album_vanity_id,
      },
      artist: {
        id: data.track.artist_id,
        name: data.track.artist_name,
      },
    };
  }

  throw new Error('Unexpected response from Musixmatch API.');
}
