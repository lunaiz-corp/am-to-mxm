import { BadRequestError } from '../exceptions/BadRequest.exception';

import { IAppleMusicUrl } from '../types/appleUrl.type';
import { EMxmUrlType, IMxmUrl } from '../types/mxmUrl.type';

import { getAppleDeveloperToken } from './appleToken.util';

export async function requestToApple(data: IAppleMusicUrl) {
  const url = `https://api.music.apple.com/v1/catalog/${data.storefront}/${data.type}/${data.id}`;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${await getAppleDeveloperToken()}`,
    },
  });
}

export function requestToMxm(data: IMxmUrl) {
  if (!process.env.MUSIXMATCH_API_KEY) {
    throw new Error('Musixmatch API key is not provided.');
  }

  const url = new URL(`https://api.musixmatch.com/ws/1.1/${data.type}.get`);
  url.searchParams.set('apikey', process.env.MUSIXMATCH_API_KEY);

  if (data.id && data.type === EMxmUrlType.ALBUM) {
    url.searchParams.set('album_id', data.id);
  } else if (data.id && EMxmUrlType.TRACK) {
    url.searchParams.set('commontrack_id', data.id);
  } else if (data.vanityId && EMxmUrlType.ALBUM) {
    url.searchParams.set('album_vanity_id', data.vanityId);
  } else if (data.vanityId && EMxmUrlType.TRACK) {
    url.searchParams.set('commontrack_vanity_id', data.vanityId);
  } else if (data.isrc) {
    url.searchParams.set('track_isrc', data.isrc);
  } else {
    throw new BadRequestError(
      'Unsupported URL format. Please check the URL again.\n' +
        'Working example: https://www.musixmatch.com/album/Mingturn/BLUE-EP',
    );
  }

  return fetch(url.toString());
}
