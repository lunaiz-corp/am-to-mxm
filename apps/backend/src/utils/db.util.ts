/* eslint-disable @typescript-eslint/no-explicit-any, class-methods-use-this */
import knex, { Knex } from 'knex';
import { type ILogObj, Logger } from 'tslog';

class DatabaseUtil {
  declare logger: Logger<ILogObj>;

  declare connection: Knex;

  declare initialised: boolean;

  constructor() {
    this.logger = new Logger({
      name: `utils.${DatabaseUtil.name}`,
      type: 'pretty',
    });

    this.connection = knex({
      client: 'better-sqlite3',
      connection: {
        filename: './cache.sqlite',
      },
      useNullAsDefault: true,
    });
  }

  public async init() {
    if (!(await this.connection.schema.hasTable('am-token-cache'))) {
      // create am-token-cache if not exists
      await this.connection.schema.createTable('am-token-cache', (table) => {
        table.string('token').primary();
        table.datetime('cached_at').defaultTo(this.connection.fn.now());
      });

      this.logger.debug('Created am-token-cache table');
    }

    if (!(await this.connection.schema.hasTable('am-cache'))) {
      // create am-cache if not exists
      await this.connection.schema.createTable('am-cache', (table) => {
        // IAppleOptimisedResponse
        table.string('id').primary();
        table.string('isrc');
        table.string('name');
        table.string('url');

        table.integer('trackNumber');
        table.integer('discNumber');

        table.string('releaseDate');
        table.integer('durationInMillis');

        table.string('artwork__url');

        table.string('album__id');
        table.string('album__name');

        table.string('artist__name');

        table.datetime('cached_at').defaultTo(this.connection.fn.now());
      });

      this.logger.debug('Created am-cache table');
    }

    if (!(await this.connection.schema.hasTable('mxm-cache'))) {
      // create mxm-cache if not exists
      await this.connection.schema.createTable('mxm-cache', (table) => {
        // IMxmTrackOptimisedResponse

        table.integer('abstrack').primary();
        table.string('isrc');
        table.string('name');

        table.string('url');
        table.string('vanityId');

        table.integer('album__id');
        table.string('album__name');

        table.integer('artist__id');
        table.string('artist__name');

        table.datetime('cached_at').defaultTo(this.connection.fn.now());
      });

      this.logger.debug('Created mxm-cache table');
    }

    if (!(await this.connection.schema.hasTable('mxm-album-cache'))) {
      // create mxm-album-cache if not exists
      await this.connection.schema.createTable('mxm-album-cache', (table) => {
        // IMxmAlbumOptimisedResponse

        table.integer('id').primary();
        table.string('name');

        table.string('url');

        table.integer('artist__id');
        table.string('artist__name');

        table.integer('externalIds__itunes');

        table.datetime('cached_at').defaultTo(this.connection.fn.now());
      });

      this.logger.debug('Created mxm-album-cache table');
    }

    if (!(await this.connection.schema.hasTable('byok-keypair'))) {
      // create byok-keypair if not exists
      await this.connection.schema.createTable('byok-keypair', (table) => {
        table.string('sessionKey').primary();
        table.string('publicKey');
        table.string('privateKey');
        table.datetime('cached_at').defaultTo(this.connection.fn.now());
      });

      this.logger.debug('Created byok-keypair table');
    }
  }
}

export default DatabaseUtil;
