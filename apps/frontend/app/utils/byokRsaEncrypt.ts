import { fromByteArray as base64FromByteArray } from 'base64-js';

import { ByokClient as ByokServiceClient } from '@packages/grpc/__generated__/am2mxm-api';
import { Empty } from '@packages/grpc/__generated__/google/protobuf/empty';

const client = new ByokServiceClient(import.meta.env.VITE_API_URL);
const algorithm = {
  name: 'RSA-OAEP',
  hash: { name: 'SHA-256' },
};

export async function encodeRsa(data: string) {
  const publicKey = await client.getEncPublicKey(new Empty({}), null);
  const spkiPublicKey = await crypto.subtle.importKey(
    'jwk',
    publicKey.public_key,
    algorithm,
    false,
    ['encrypt'],
  );

  const encrypted = await crypto.subtle.encrypt(
    algorithm,
    spkiPublicKey,
    new TextEncoder().encode(data),
  );

  return {
    sessionKey: publicKey.session_key,
    // TODO: Check why this is different that generated from server and fix it
    encrypted: base64FromByteArray(new Uint8Array(encrypted)),
  };
}
