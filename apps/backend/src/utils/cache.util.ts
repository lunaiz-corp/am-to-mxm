import { createCache } from 'cache-manager';

import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';

const cache = createCache({
  // ttl -> 7 days
  ttl: 60 * 60 * 24 * 7,

  stores: [
    new Keyv({
      store: new KeyvSqlite({
        uri: 'sqlite://cache.sqlite',
        table: 'cache',
        busyTimeout: 10000,
      }),
    }),
  ],
});

export default cache;
