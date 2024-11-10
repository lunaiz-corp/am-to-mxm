import * as grpc from '@grpc/grpc-js';

import { ILogObj, Logger } from 'tslog';

import {
  SearchQuery,
  SearchResult,
  UnimplementedSearchService,
  TrackInfo,
} from '@packages/grpc/__generated__/am2mxm-api';

import DatabaseUtil from '../utils/db.util';
import { parseAppleUrl, parseMxmUrl } from '../utils/parseUrl.util';
import { requestToApple, requestToMxm } from '../utils/request.util';
import { decryptByokKey } from '../utils/byokKey.util';
import {
  parseAlbumResponseFromMxm,
  parseResponseFromApple,
  parseTrackResponseFromMxm,
} from '../utils/parseResponse.util';

import { flattenObject } from '../utils/es-toolkit-inspired/flattenObject';
import { unflattenObject } from '../utils/es-toolkit-inspired/unflattenObject';
import { isNilOrBlank } from '../utils/es-toolkit-inspired/isNilOrBlank';

import { BadRequestError } from '../exceptions/BadRequest.exception';

import { DatabaseResult } from '../types/db.type';

import { EMxmUrlType } from '../types/mxmUrl.type';
import { EAppleMusicUrlType } from '../types/appleUrl.type';
import { IAppleErrorResponse } from '../types/appleErrorResponse.type';

import {
  IMxmAlbumOptimisedResponse,
  IMxmTrackOptimisedResponse,
} from '../types/mxmOptimisedResponse.type';
import { IAppleOptimisedResponse } from '../types/appleOptimisedResponse.type';

const logger: Logger<ILogObj> = new Logger({
  name: 'lunaiz.am2mxm.api.v1.Search',
  type: 'pretty',
});

const database = new DatabaseUtil();

export class SearchService extends UnimplementedSearchService {
  // eslint-disable-next-line class-methods-use-this
  async SearchMxMLink(
    call: grpc.ServerUnaryCall<SearchQuery, SearchResult>,
    callback: grpc.sendUnaryData<SearchResult>,
  ): Promise<void> {
    try {
      // Get track/album info from Apple Music
      const knex = database.connection;

      if (isNilOrBlank(call.request.query)) {
        throw new BadRequestError('Request missing required field: query');
      }

      const usesAppleByokKey =
        !isNilOrBlank(call.request.byok.session_key) &&
        !isNilOrBlank(call.request.byok.am_teamid) &&
        !isNilOrBlank(call.request.byok.am_keyid) &&
        !isNilOrBlank(call.request.byok.am_secret_key);

      const appleByokTeamId = usesAppleByokKey
        ? await decryptByokKey(
            call.request.byok.session_key,
            call.request.byok.am_teamid,
            knex,
          )
        : undefined;
      const appleByokKeyId = usesAppleByokKey
        ? await decryptByokKey(
            call.request.byok.session_key,
            call.request.byok.am_keyid,
            knex,
          )
        : undefined;
      const appleByokKey = usesAppleByokKey
        ? await decryptByokKey(
            call.request.byok.session_key,
            call.request.byok.am_secret_key,
            knex,
          )
        : undefined;

      const mxmByokKey =
        !isNilOrBlank(call.request.byok.session_key) &&
        !isNilOrBlank(call.request.byok.mxm_key)
          ? await decryptByokKey(
              call.request.byok.session_key,
              call.request.byok.mxm_key,
              knex,
            )
          : undefined;

      const parsedAppleUrl = parseAppleUrl(call.request.query);

      let result:
        | DatabaseResult<IAppleOptimisedResponse>[]
        | IAppleOptimisedResponse[];

      if (parsedAppleUrl.type === EAppleMusicUrlType.SONG) {
        result = await knex<DatabaseResult<IAppleOptimisedResponse>>(
          'am-cache',
        ).where('id', parsedAppleUrl.id);
      } else {
        result = await knex<DatabaseResult<IAppleOptimisedResponse>>(
          'am-cache',
        ).where('album__id', parsedAppleUrl.id);
      }

      if (result) {
        result = result.map(
          (x) => unflattenObject(x) as IAppleOptimisedResponse,
        );
      }

      if (!result || result.length <= 0) {
        const appleResponse = (await requestToApple(
          parsedAppleUrl,
          knex,
          appleByokTeamId,
          appleByokKeyId,
          appleByokKey,
        ).then((res) => res.json())) as
          | AppleMusicApi.AlbumResponse
          | AppleMusicApi.SongResponse
          | IAppleErrorResponse;

        if ('errors' in appleResponse) {
          throw new Error(appleResponse.errors.map((e) => e.detail).join('\n'));
        }

        result = parseResponseFromApple(appleResponse.data);
        result.forEach(async (item) => {
          await knex<DatabaseResult<IAppleOptimisedResponse>>(
            'am-cache',
          ).insert({
            ...flattenObject(item),
            cached_at: new Date().getTime(),
          });
        });
      }

      // Filter out duplicate ISRCs
      result = Object.values(
        result.reduce(
          (acc, item) => {
            if (!acc[item.isrc] || acc[item.isrc].id > item.id) {
              acc[item.isrc] = item;
            }
            return acc;
          },
          {} as Record<string, IAppleOptimisedResponse>,
        ),
      );

      const mxmResponses: IMxmTrackOptimisedResponse[] = await Promise.all(
        result.map(async (item) => {
          const cached = await knex<DatabaseResult<IMxmTrackOptimisedResponse>>(
            'mxm-cache',
          )
            .where('isrc', item.isrc)
            .first();

          if (cached) {
            return unflattenObject(cached) as IMxmTrackOptimisedResponse;
          }

          // Search for the item in Musixmatch
          const r = await requestToMxm(
            {
              type: EMxmUrlType.TRACK,
              isrc: item.isrc,
            },
            mxmByokKey,
          );

          if (r.error || !r.data) {
            throw new Error(
              "The track hasn't been imported yet. Please try again after 1-5 minutes.\n" +
                'If the problem persists after 15 minutes, please contact to the developer.',
            );
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const realResp = r.data;
          const parsedResp = parseTrackResponseFromMxm(
            realResp.message!.body!,
            item.isrc,
          );

          await knex<DatabaseResult<IMxmTrackOptimisedResponse>>(
            'mxm-cache',
          ).insert({
            ...flattenObject(parsedResp),
            cached_at: new Date().getTime(),
          });

          return parsedResp;
        }),
      );

      return callback(
        null,
        new SearchResult({
          tracks: mxmResponses.map((x) => {
            const tempAppleResponse = result.find((y) => y.isrc === x.isrc)!;

            return new TrackInfo({
              isrc: x.isrc || tempAppleResponse.isrc,
              title: x.name || tempAppleResponse.name,
              artist: x.artist.name || tempAppleResponse.artist.name,
              mxm_abstrack: x.abstrack,
              mxm_track_url: x.url,
              mxm_album: x.album.name,
              mxm_album_url: `https://www.musixmatch.com/album/${x.artist.id}/${x.album.id}`,
              am_track_url: tempAppleResponse.url,
              am_album_url: `https://music.apple.com/album/${tempAppleResponse.album.id}?i=${tempAppleResponse.id}`,
              am_thumbnail:
                tempAppleResponse.artwork.url ||
                'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            });
          }),
        }),
      );
    } catch (error) {
      logger.error(error);

      if (error instanceof BadRequestError) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: error.message,
        } as grpc.ServiceError);
      }

      return callback({
        code: grpc.status.INTERNAL,
        details: (error as Error).message || 'Internal Server Error',
      } as grpc.ServiceError);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async SearchAMSource(
    call: grpc.ServerUnaryCall<SearchQuery, SearchResult>,
    callback: grpc.sendUnaryData<SearchResult>,
  ): Promise<void> {
    try {
      // Get track/album info from Musixmatch
      const knex = database.connection;

      if (isNilOrBlank(call.request.query)) {
        throw new BadRequestError('Request missing required field: query');
      }

      const mxmByokKey =
        !isNilOrBlank(call.request.byok.session_key) &&
        !isNilOrBlank(call.request.byok.mxm_key)
          ? await decryptByokKey(
              call.request.byok.session_key,
              call.request.byok.mxm_key,
              knex,
            )
          : undefined;

      let parsedMxmUrl = parseMxmUrl(call.request.query);
      if (parsedMxmUrl.type === EMxmUrlType.ALBUM_TRACKS) {
        parsedMxmUrl.type = EMxmUrlType.ALBUM;
      }

      let result;
      if (parsedMxmUrl.type === EMxmUrlType.TRACK) {
        if (parsedMxmUrl.id) {
          result = await knex<DatabaseResult<IMxmTrackOptimisedResponse>>(
            'mxm-cache',
          )
            .where('abstrack', parsedMxmUrl.id)
            .first();
        } else {
          result = await knex<DatabaseResult<IMxmTrackOptimisedResponse>>(
            'mxm-cache',
          )
            .where('vanityId', parsedMxmUrl.vanityId)
            .first();
        }

        if (result) {
          result = unflattenObject(result);
        }

        if (!result) {
          const r = await requestToMxm(parsedMxmUrl, mxmByokKey);
          if (r.error || !r.data) {
            throw new Error(
              "The track hasn't been imported yet. Please request Mxm team to import this track.\n" +
                'You can request them by sending the track URL in #catalogue-issues in Community Slack.',
            );
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const realResp = r.data;
          result = parseTrackResponseFromMxm(realResp.message!.body!);

          await knex<DatabaseResult<IMxmTrackOptimisedResponse>>(
            'mxm-cache',
          ).insert({
            ...flattenObject(result),
            cached_at: new Date().getTime(),
          });
        }

        parsedMxmUrl = {
          type: EMxmUrlType.ALBUM,
          id: result.album.id,
          vanityId: result.album.vanityId,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resultAlbum;

      // TODO: Find better way to check if the album is cached
      // How to use vanityId here? (not returned from MXM API)
      if (parsedMxmUrl.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resultAlbum = await knex<DatabaseResult<any>>('mxm-album-cache')
          .where('id', parsedMxmUrl.id)
          .first();
      }

      if (resultAlbum) {
        resultAlbum = unflattenObject(resultAlbum);
      }

      if (!resultAlbum) {
        const r = await requestToMxm(parsedMxmUrl, mxmByokKey);
        if (r.error || !r.data) {
          throw new Error(
            "The album hasn't been imported yet. Please request Mxm team to import this album.\n" +
              'You can request them by sending the album URL in #catalogue-issues in Community Slack.',
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const albumResp = r.data;
        resultAlbum = parseAlbumResponseFromMxm(albumResp.message!.body!);

        const hasCacheWithOtherKey = await knex<
          DatabaseResult<IMxmAlbumOptimisedResponse>
        >('mxm-album-cache')
          .where('id', resultAlbum.id)
          .first();

        if (!hasCacheWithOtherKey) {
          await knex<DatabaseResult<IMxmAlbumOptimisedResponse>>(
            'mxm-album-cache',
          ).insert({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...flattenObject(resultAlbum),
            cached_at: new Date().getTime(),
          });
        }
      }

      return callback(
        null,
        new SearchResult({
          tracks: [
            new TrackInfo({
              isrc: result?.isrc || '',
              title: result?.name || '',
              artist: result?.artist.name || resultAlbum.artist.name || '',
              mxm_abstrack: result?.abstrack || 0,
              mxm_track_url: result?.url || '',
              mxm_album: resultAlbum.name,
              mxm_album_url:
                resultAlbum.url ||
                `https://www.musixmatch.com/album/${resultAlbum.artist.id}/${resultAlbum.id}`,
              am_track_url: '',
              am_album_url: resultAlbum.externalIds.itunes
                ? `https://music.apple.com/album/${resultAlbum.externalIds.itunes}`
                : '',
              am_thumbnail: '',
            }),
          ],
        }),
      );
    } catch (error) {
      logger.error(error);

      if (error instanceof BadRequestError) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: error.message,
        } as grpc.ServiceError);
      }

      return callback({
        code: grpc.status.INTERNAL,
        details: (error as Error).message || 'Internal Server Error',
      } as grpc.ServiceError);
    }
  }
}

export default SearchService;
