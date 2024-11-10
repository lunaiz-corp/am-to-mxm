import * as grpc from '@grpc/grpc-js';

import { ILogObj, Logger } from 'tslog';

import {
  ByokQuery,
  ByokResult,
  ByokEncResult,
  ByokEncJwk,
  UnimplementedByokService,
} from '@packages/grpc/__generated__/am2mxm-api';
import { Empty } from '@packages/grpc/__generated__/google/protobuf/empty';

import DatabaseUtil from '../utils/db.util';
import { requestToMxm } from '../utils/request.util';
import { decryptByokKey, getNewKeyPair } from '../utils/byokKey.util';
import { getAppleDeveloperToken } from '../utils/appleToken.util';

import { isNilOrBlank } from '../utils/es-toolkit-inspired/isNilOrBlank';

import { BadRequestError } from '../exceptions/BadRequest.exception';

import { EMxmUrlType } from '../types/mxmUrl.type';

const logger: Logger<ILogObj> = new Logger({
  name: 'lunaiz.am2mxm.api.v1.Byok',
  type: 'pretty',
});

const database = new DatabaseUtil();

export class ByokService extends UnimplementedByokService {
  // eslint-disable-next-line class-methods-use-this
  async getEncPublicKey(
    _: grpc.ServerUnaryCall<Empty, ByokEncResult>,
    callback: grpc.sendUnaryData<ByokEncResult>,
  ): Promise<void> {
    try {
      // Get RSA Public Key for encrypt of BYOK key

      const knex = database.connection;
      const { sessionKey, publicKey } = await getNewKeyPair(knex);

      return callback(
        null,
        new ByokEncResult({
          session_key: sessionKey,
          public_key: new ByokEncJwk({
            ...(await crypto.subtle.exportKey('jwk', publicKey)),
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
  async checkMxMKeyValidity(
    call: grpc.ServerUnaryCall<ByokQuery, ByokResult>,
    callback: grpc.sendUnaryData<ByokResult>,
  ): Promise<void> {
    try {
      // Validate Musixmatch BYOK key
      const knex = database.connection;

      if (isNilOrBlank(call.request.session_key)) {
        throw new BadRequestError(
          'Request missing required field: session_key',
        );
      }

      if (isNilOrBlank(call.request.mxm_key)) {
        throw new BadRequestError('Request missing required field: mxm_key');
      }

      const byokKey = await decryptByokKey(
        call.request.session_key,
        call.request.mxm_key,
        knex,
      );

      if (!byokKey) {
        return callback(null, new ByokResult({ valid: false }));
      }

      logger.debug('Decrypted BYOK key:', byokKey);

      const r = await requestToMxm(
        {
          type: EMxmUrlType.TRACK,
          isrc: 'GBARL9300135', // Never gonna give you up
        },
        byokKey,
      );

      return callback(
        null,
        new ByokResult({
          valid:
            !r.error &&
            r.data &&
            String(r.data.message?.header?.status_code || '500').startsWith(
              '2',
            ),
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
  async checkAMKeyValidity(
    call: grpc.ServerUnaryCall<ByokQuery, ByokResult>,
    callback: grpc.sendUnaryData<ByokResult>,
  ): Promise<void> {
    try {
      // Validate Apple Music BYOK key
      const knex = database.connection;

      if (isNilOrBlank(call.request.session_key)) {
        throw new BadRequestError(
          'Request missing required field: session_key',
        );
      }

      if (isNilOrBlank(call.request.am_teamid)) {
        throw new BadRequestError('Request missing required field: am_teamid');
      }

      if (isNilOrBlank(call.request.am_keyid)) {
        throw new BadRequestError('Request missing required field: am_keyid');
      }

      if (isNilOrBlank(call.request.am_secret_key)) {
        throw new BadRequestError(
          'Request missing required field: am_secret_key',
        );
      }

      const teamId = await decryptByokKey(
        call.request.session_key,
        call.request.am_teamid,
        knex,
      );
      const keyId = await decryptByokKey(
        call.request.session_key,
        call.request.am_keyid,
        knex,
      );
      const byokKey = await decryptByokKey(
        call.request.session_key,
        call.request.am_secret_key,
        knex,
      );

      if (!teamId || !keyId || !byokKey) {
        return callback(null, new ByokResult({ valid: false }));
      }

      logger.debug('Decrypted BYOK teamId:', teamId);
      logger.debug('Decrypted BYOK keyId:', keyId);
      logger.debug('Decrypted BYOK key:', byokKey);

      const r = await fetch('https://api.music.apple.com/v1/test', {
        headers: {
          Authorization: `Bearer ${await getAppleDeveloperToken(
            teamId,
            keyId,
            byokKey,
          )}`,
        },
      });

      return callback(null, new ByokResult({ valid: r.ok }));
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

export default ByokService;
