import * as jose from 'jose';
import cache from './cache.util';

// eslint-disable-next-line import/prefer-default-export
export async function getAppleDeveloperToken() {
  const { APPLE_MUSIC_PRIVATE_KEY, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_TEAM_ID } =
    process.env;

  if (!APPLE_MUSIC_PRIVATE_KEY) {
    throw new Error('Private key is not defined');
  }

  if (!APPLE_MUSIC_KEY_ID) {
    throw new Error('Key ID is not defined');
  }

  if (!APPLE_MUSIC_TEAM_ID) {
    throw new Error('Team ID is not defined');
  }

  const cachedToken = await cache.get('appleMusicToken');
  if (cachedToken) return cachedToken;

  const privateKey = await jose.importPKCS8(
    // eslint-disable-next-line prefer-template
    '-----BEGIN PRIVATE KEY-----\n' +
      Buffer.from(APPLE_MUSIC_PRIVATE_KEY, 'base64').toString('utf-8') +
      '\n-----END PRIVATE KEY-----',
    'ES256',
  );

  const token = await new jose.SignJWT()
    .setProtectedHeader({
      alg: 'ES256',
      kid: process.env.APPLE_MUSIC_KEY_ID,
    })
    .setIssuer(APPLE_MUSIC_TEAM_ID)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(privateKey);

  await cache.set('appleMusicToken', token, 60 * 60 * 24 * 7);

  return token;
}
