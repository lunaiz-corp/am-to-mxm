import type { IAppleOptimisedResponse } from '../types/appleOptimisedResponse.type';
import {
  IMxmAlbumOptimisedResponse,
  IMxmTrackOptimisedResponse,
} from '../types/mxmOptimisedResponse.type';

import { components } from '../__generated__/musixmatch';

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

function extractMxmVanityIdFromUrl(url: string): string | null {
  const splitedUrl = url.match(/musixmatch\.com\/[^/]+\/([^/]+\/[^?/]+)/);
  return splitedUrl ? splitedUrl[1] : null;
}

export function parseTrackResponseFromMxm(
  data:
    | {
        track_list?: components['schemas']['Track'][];
      }
    | {
        album?: components['schemas']['Album'];
      }
    | {
        track?: components['schemas']['Track'];
      },
  isrc?: string,
): IMxmTrackOptimisedResponse {
  if ('track' in data && data.track) {
    const vanityIdInferenced = extractMxmVanityIdFromUrl(
      data.track.track_share_url!,
    );

    return {
      abstrack: data.track.commontrack_id!,
      isrc: data.track.track_isrc! || isrc!,
      name: data.track.track_name!,

      url: data.track.track_share_url!,
      vanityId: data.track.commontrack_vanity_id! || vanityIdInferenced!,

      album: {
        id: data.track.album_id!,
        name: data.track.album_name!,
      },
      artist: {
        id: data.track.artist_id!,
        name: data.track.artist_name!,
      },
    };
  }

  throw new Error('Unexpected response from Musixmatch API.');
}

export function parseAlbumResponseFromMxm(
  data:
    | {
        track_list?: components['schemas']['Track'][];
      }
    | {
        album?: components['schemas']['Album'];
      }
    | {
        track?: components['schemas']['Track'];
      },
): IMxmAlbumOptimisedResponse {
  if ('album' in data && data.album) {
    return {
      id: data.album.album_id!,
      name: data.album.album_name!,

      url: `https://www.musixmatch.com/album/${data.album.artist_id}/${data.album.album_id}`,

      artist: {
        id: data.album.artist_id!,
        name: data.album.artist_name!,
      },

      externalIds: {
        // @ts-expect-error - x
        itunes: data.album.external_ids.itunes[0],
      },
    };
  }

  throw new Error('Unexpected response from Musixmatch API.');
}
