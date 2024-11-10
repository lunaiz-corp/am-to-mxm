import { ByokEncResult } from '@packages/grpc/__generated__/am2mxm-api';

const algorithm = {
  name: 'RSA-OAEP',
  hash: { name: 'SHA-256' },
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);

  // eslint-disable-next-line no-restricted-syntax
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }

  return window.btoa(binary);
}

// eslint-disable-next-line import/prefer-default-export
export async function encodeRsa(publicKey: ByokEncResult, data: string) {
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
    encrypted: arrayBufferToBase64(encrypted),
  };
}
