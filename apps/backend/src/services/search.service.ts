/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as grpc from '@grpc/grpc-js';
import { isNil } from 'es-toolkit/predicate';

import { ILogObj, Logger } from 'tslog';

import {
  SearchType,
  SearchQuery,
  SearchResult,
  UnimplementedSearchService,
  TrackInfo,
} from '@packages/grpc/__generated__/am2mxm-api';

import cache from '../utils/cache.util';
import { parseAppleUrl } from '../utils/parseUrl.util';
import { requestToApple, requestToMxm } from '../utils/request.util';
import {
  parseResponseFromApple,
  parseResponseFromMxm,
} from '../utils/parseResponse.util';

import { BadRequestError } from '../exceptions/BadRequest.exception';

import { IAppleErrorResponse } from '../types/appleErrorResponse.type';
import { EMxmUrlType } from '../types/mxmUrl.type';
import { IAppleOptimisedResponse } from '../types/appleOptimisedResponse.type';
import { IMxmOptimisedResponse } from '../types/mxmOptimisedResponse.type';

const logger: Logger<ILogObj> = new Logger({
  name: 'lunaiz.am2mxm.api.v1.Search',
  type: 'pretty',
});

export class SearchService extends UnimplementedSearchService {
  // eslint-disable-next-line class-methods-use-this
  async SearchByQuery(
    call: grpc.ServerUnaryCall<SearchQuery, SearchResult>,
    callback: grpc.requestCallback<SearchResult>,
  ) {
    try {
      logger.debug(call.request);
      logger.debug(call.request.type, call.request.query);

      if (isNil(call.request.type)) {
        throw new BadRequestError('Request missing required field: type');
      }

      if (isNil(call.request.query) || call.request.query === '') {
        throw new BadRequestError('Request missing required field: query');
      }

      if (call.request.type === SearchType.LINK) {
        // Get track/album info from Apple Music
        const parsedAppleUrl = parseAppleUrl(call.request.query);
        const appleResponse = (await requestToApple(parsedAppleUrl).then(
          (res) => res.json(),
        )) as
          | AppleMusicApi.AlbumResponse
          | AppleMusicApi.SongResponse
          | IAppleErrorResponse;

        if ('errors' in appleResponse) {
          throw new Error(appleResponse.errors.map((e) => e.detail).join('\n'));
        }

        let result = await cache.get<IAppleOptimisedResponse[]>(
          `apple:${parsedAppleUrl.id}`,
        );

        if (!result) {
          result = parseResponseFromApple(appleResponse.data);
          cache.set(`apple:${parsedAppleUrl.id}`, result);
        }

        const mxmResponses = await Promise.all(
          result.map(async (item) => {
            const cached = await cache.get<IMxmOptimisedResponse>(
              `mxm:${item.isrc}`,
            );

            if (cached) return cached;

            // Search for the item in Musixmatch
            const r = await requestToMxm({
              type: EMxmUrlType.TRACK,
              isrc: item.isrc,
            });

            if (!r.ok) {
              throw new Error(
                "The track hasn't been imported yet. Please try again after 1-5 minutes.\n" +
                  'If the problem persists after 15 minutes, please contact to the developer.',
              );
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const realResp = (await r.json()) as any;
            const parsedResp = parseResponseFromMxm(
              realResp.message.body,
              item.isrc,
            );

            cache.set(`mxm:${item.isrc}`, parsedResp);
            return parsedResp;
          }),
        );

        callback(
          null,
          new SearchResult({
            type: SearchType.LINK,
            tracks: mxmResponses.map((x) => {
              const tempAppleResponse = result.find((y) => y.isrc === x.isrc)!;

              return new TrackInfo({
                isrc: x.isrc || tempAppleResponse.isrc,
                title: x.name || tempAppleResponse.name,
                artist: x.artist.name || tempAppleResponse.artist.name,
                mxm_abstrack: x.abstrack,
                mxm_track_url: x.url,
                mxm_album: x.album.name,
                mxm_album_url: `https://www.musixmatch.com/album/${x.album.vanityId}`,
                am_track_url: tempAppleResponse.url,
                am_album_url: `https://music.apple.com/album/${tempAppleResponse.album.id}?i=${tempAppleResponse.id}`,
              });
            }),
          }),
        );
      } else if (call.request.type === SearchType.SOURCE) {
        // TODO: Implement this
      } else if (call.request.type === SearchType.ABSTRACK) {
        // TODO: Implement this
      }
    } catch (error) {
      logger.error(error);

      if (error instanceof BadRequestError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: error.message,
        } as grpc.ServiceError);
      } else {
        callback({
          code: grpc.status.INTERNAL,
          details: (error as Error).message || 'Internal Server Error',
        } as grpc.ServiceError);
      }
    }
  }
}

export default SearchService;
