// TODO: RSA Encryption and Decryption

import { randomBytes, webcrypto } from 'node:crypto';

import { Knex } from 'knex';
import { DatabaseResult } from '../types/db.type';

type Base64KeyPair = {
  sessionKey: string;
  publicKey: string;
  privateKey: string;
};

type CryptoKeyPair = {
  sessionKey: string;
  publicKey: webcrypto.CryptoKey;
  privateKey: webcrypto.CryptoKey;
};

const importAlgo = {
  name: 'RSA-OAEP',
  hash: { name: 'SHA-256' },
};

const algorithm = {
  ...importAlgo,
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
};

export async function getNewKeyPair(knex: Knex): Promise<CryptoKeyPair> {
  const keySession = randomBytes(24).toString('base64');
  const keyPair = await webcrypto.subtle.generateKey(algorithm, true, [
    'decrypt',
    'encrypt',
  ]);

  await knex<DatabaseResult<Base64KeyPair>>('byok-keypair').insert({
    sessionKey: keySession,
    publicKey: Buffer.from(
      await webcrypto.subtle.exportKey('spki', keyPair.publicKey),
    ).toString('base64'),
    privateKey: Buffer.from(
      await webcrypto.subtle.exportKey('pkcs8', keyPair.privateKey),
    ).toString('base64'),
    cached_at: new Date().getTime(),
  });

  return {
    sessionKey: keySession,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function getKeyPairBySessionKey(
  keySession: string,
  knex: Knex,
): Promise<CryptoKeyPair | null> {
  const generatedKeyPair = await knex<DatabaseResult<Base64KeyPair>>(
    'byok-keypair',
  )
    .where('sessionKey', keySession)
    .first();

  if (generatedKeyPair) {
    // key only valid for 10 minutes
    if (generatedKeyPair.cached_at + 1000 * 60 * 10 < new Date().getTime()) {
      await knex<DatabaseResult<Base64KeyPair>>('byok-keypair')
        .where('sessionKey', keySession)
        .delete();

      return null;
    }

    return {
      sessionKey: keySession,
      publicKey: await webcrypto.subtle.importKey(
        'spki',
        new Uint8Array(Buffer.from(generatedKeyPair.publicKey, 'base64')),
        importAlgo,
        true,
        ['encrypt'],
      ),
      privateKey: await webcrypto.subtle.importKey(
        'pkcs8',
        new Uint8Array(Buffer.from(generatedKeyPair.privateKey, 'base64')),
        importAlgo,
        true,
        ['decrypt'],
      ),
    };
  }

  return null;
}

export async function decryptByokKey(
  keySession: string,
  encryptedKey: string,
  knex: Knex,
): Promise<string> {
  const keyPair = await getKeyPairBySessionKey(keySession, knex);

  if (!keyPair) {
    throw new Error(
      'Your session has been expired.\nPlease refresh the page, and try again.',
    );
  }

  const decryptedData = await webcrypto.subtle.decrypt(
    importAlgo,
    keyPair.privateKey,
    new Uint8Array(Buffer.from(encryptedKey, 'base64')),
  );

  return new TextDecoder('utf-8').decode(decryptedData);
}
