import { BadRequestError } from '../exceptions/BadRequest.exception';
import {
  type IAppleMusicUrl,
  EAppleMusicUrlType,
} from '../types/appleUrl.type';
import { EMxmUrlType, IMxmUrl } from '../types/mxmUrl.type';

const STOREFRONT_REGEX =
  /^(a(d|e|f|g|i|l|m|n|o|r|s|t|q|u|w|x|z)|b(a|b|d|e|f|g|h|i|j|l|m|n|o|r|s|t|v|w|y|z)|c(a|c|d|f|g|h|i|k|l|m|n|o|r|u|v|x|y|z)|d(e|j|k|m|o|z)|e(c|e|g|h|r|s|t)|f(i|j|k|m|o|r)|g(a|b|d|e|f|g|h|i|l|m|n|p|q|r|s|t|u|w|y)|h(k|m|n|r|t|u)|i(d|e|q|l|m|n|o|r|s|t)|j(e|m|o|p)|k(e|g|h|i|m|n|p|r|w|y|z)|l(a|b|c|i|k|r|s|t|u|v|y)|m(a|c|d|e|f|g|h|k|l|m|n|o|q|p|r|s|t|u|v|w|x|y|z)|n(a|c|e|f|g|i|l|o|p|r|u|z)|om|p(a|e|f|g|h|k|l|m|n|r|s|t|w|y)|qa|r(e|o|s|u|w)|s(a|b|c|d|e|g|h|i|j|k|l|m|n|o|r|t|v|y|z)|t(c|d|f|g|h|j|k|l|m|n|o|r|t|v|w|z)|u(a|g|m|s|y|z)|v(a|c|e|g|i|n|u)|w(f|s)|y(e|t)|z(a|m|w))$/;

const MXM_PARSE_REGEX =
  /album\/([^?]+\/[^?]+)|album\/(\d+)|lyrics\/([^?]+\/[^?]+)/;

const ISRC_REGEX = /^[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}$/;

export function parseAppleUrl(url: string): IAppleMusicUrl {
  if (!ISRC_REGEX.test(url)) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/');
      path.shift(); // remove the first empty string

      // URL: https://music.apple.com/kr/album/blue-ep/1748504604
      // id: 1748504604
      // storefront: kr
      // type: EAplleMusicUrlType.ALBUM

      if (path[0].length !== 2) {
        // assume the country code is `us`
        path.unshift('us');
      }

      if (
        urlObj.hostname !== 'music.apple.com' ||
        path.length < 4 ||
        path.length > 5 ||
        !STOREFRONT_REGEX.test(path[0]) ||
        !['album', 'song'].includes(path[1]) ||
        !/^\d+$/.test(path[path.length - 1])
      ) {
        throw new BadRequestError(
          'Unsupported URL format.\n' +
            'Working example: https://music.apple.com/kr/album/blue-ep/1748504604',
        );
      }

      return {
        id: path[path.length - 1],
        storefront: path[0],
        type: EAppleMusicUrlType[
          path[1].toUpperCase() as keyof typeof EAppleMusicUrlType
        ],
        url,
      };
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Invalid URL') {
        throw new BadRequestError(
          'Invalid URL format.\n' +
            'Working example: https://music.apple.com/kr/album/blue-ep/1748504604',
        );
      }

      throw error;
    }
  } else {
    return {
      id: url, // ISRC
      storefront: 'us',
      type: EAppleMusicUrlType.SONG,
      url: 'ISRC',
    };
  }
}

export function parseMxmUrl(url: string): IMxmUrl {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/');
    path.shift(); // remove the first empty string

    // URL: https://www.musixmatch.com/album/Mingturn/BLUE-EP
    // id: Mingturn/BLUE-EP
    // type: EMxmUrlType.ALBUM_TRACKS

    if (
      urlObj.hostname !== 'www.musixmatch.com' &&
      urlObj.hostname !== 'musixmatch.com' &&
      urlObj.hostname !== 'com-beta.musixmatch.com'
    ) {
      throw new BadRequestError(
        'Unsupported URL format.\n' +
          'Working example: https://www.musixmatch.com/album/Mingturn/BLUE-EP',
      );
    }

    // get group by regex
    const group = urlObj.pathname.match(MXM_PARSE_REGEX);
    if (!group) {
      throw new BadRequestError(
        'Unsupported URL format.\n' +
          'Working example: https://www.musixmatch.com/album/Mingturn/BLUE-EP',
      );
    }

    if (group[1]) {
      return {
        type: EMxmUrlType.ALBUM_TRACKS,
        vanityId: group[1],
        url,
      };
    }

    if (group[2]) {
      return {
        type: EMxmUrlType.ALBUM_TRACKS,
        id: group[2],
        url,
      };
    }

    return {
      type: EMxmUrlType.TRACK,
      vanityId: group[3],
      url,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Invalid URL') {
      throw new BadRequestError(
        'Invalid URL format.\n' +
          'Working example: https://www.musixmatch.com/album/Mingturn/BLUE-EP',
      );
    }

    throw error;
  }
}
