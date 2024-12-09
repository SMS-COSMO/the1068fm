import { eq } from 'drizzle-orm';
import * as jose from 'jose';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { users } from '../db/schema';
import { env } from '../env';

const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
const decode = TextDecoder.prototype.decode.bind(new TextDecoder());

export async function produceAccessToken(id: string) {
  const encPublicKey = await jose.importSPKI(env.ENC_PUBLIC_KEY, 'RSA-OAEP-256');
  const signPrivateKey = await jose.importPKCS8(env.SIGN_PRIVATE_KEY, 'RS512');

  const jwt = await new jose.SignJWT({})
    .setSubject(id.toString())
    .setIssuedAt()
    .setExpirationTime(env.TOKEN_EXPIRATION_TIME)
    .setIssuer('sms-tree')
    .setJti(nanoid(32))
    .setProtectedHeader({
      alg: 'RS512',
      kid: env.SIGN_KID,
    })
    .sign(signPrivateKey);
  const jwe = await new jose.CompactEncrypt(encode(jwt))
    .setProtectedHeader({
      alg: 'RSA-OAEP-256',
      enc: 'A256GCM',
      kid: env.ENC_KID,
    })
    .encrypt(encPublicKey);
  return jwe;
}

export async function getUserFromToken(token: string) {
  try {
    const signPublicKey = await jose.importSPKI(env.SIGN_PUBLIC_KEY, 'RS512');
    const encPrivateKey = await jose.importPKCS8(env.ENC_PRIVATE_KEY, 'RSA-OAEP-256');
    const { plaintext: decryptedJwt } = await jose.compactDecrypt(token, encPrivateKey);
    const { payload } = await jose.jwtVerify(decode(decryptedJwt), signPublicKey);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub as string),
    });
    return { user };
  } catch (err) {
    if (err instanceof jose.errors.JWEDecryptionFailed)
      return { err: 'ERR_JWE_DECRYPTION_FAILED' as const };
    else if (err instanceof jose.errors.JWTExpired)
      return { err: 'ERR_JWT_EXPIRED' as const };
    else return { err: 'ERR_INVALID_TOKEN' as const };
  }
}

export async function getUserFromHeader(authorization: string | undefined) {
  if (!authorization)
    return undefined;
  const result = await getUserFromToken(authorization);
  if (result.err === 'ERR_JWT_EXPIRED')
    return result.err;
  return result.user;
}
