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
import { ILogObj, Logger } from 'tslog';

import {
  SearchQuery,
  SearchResult,
  UnimplementedSearchService,
} from '@packages/grpc/__generated__/am2mxm-api';

const logger: Logger<ILogObj> = new Logger({
  name: 'lunaiz.am2mxm.api.v1.Search',
  type: 'pretty',
});

export class SearchService extends UnimplementedSearchService {
  SearchByQuery(
    call: grpc.ServerUnaryCall<SearchQuery, SearchResult>,
    callback: grpc.requestCallback<SearchResult>,
  ) {
    logger.debug(call.request);
    logger.debug(call.request.type, call.request.query);

    callback(null, new SearchResult());
  }
}

export default SearchService;
