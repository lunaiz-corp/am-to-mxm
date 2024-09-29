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

import { ILogObj, Logger } from 'tslog';
import * as grpc from '@grpc/grpc-js';

import { SearchService } from './services/search.service';

const logger: Logger<ILogObj> = new Logger({
  name: 'lunaiz.am2mxm.api.v1',
  type: 'pretty',
});

const server = new grpc.Server();

server.addService(SearchService.definition, new SearchService());

if (require.main === module) {
  server.bindAsync(
    '0.0.0.0:52345',
    grpc.ServerCredentials.createInsecure(),

    (err, port) => {
      if (err !== null) {
        logger.error(err);
        process.exit(1);
      }

      logger.info(`🚀 lunaiz.am2mxm.api.v1 gRPC is running at ${port}.`);
    },
  );
}
