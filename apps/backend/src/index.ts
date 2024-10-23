import { ILogObj, Logger } from 'tslog';
import * as grpc from '@grpc/grpc-js';

import { SearchService } from './services/search.service';
import { ByokService } from './services/byok.service';

import DatabaseUtil from './utils/db.util';

try {
  process.loadEnvFile('.env');
} catch {} // eslint-disable-line no-empty

const logger: Logger<ILogObj> = new Logger({
  name: 'lunaiz.am2mxm.api.v1',
  type: 'pretty',
});

const server = new grpc.Server();
server.addService(SearchService.definition, new SearchService());
server.addService(ByokService.definition, new ByokService());

if (require.main === module) {
  new DatabaseUtil().init();

  server.bindAsync(
    '0.0.0.0:52345',
    grpc.ServerCredentials.createInsecure(),

    (err, port) => {
      if (err !== null) {
        logger.error(err);
        process.exit(1);
      }

      logger.info(`🚀 gRPC Server is running at ${port}!`);
    },
  );
}
