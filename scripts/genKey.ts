import { exportPKCS8, exportSPKI, generateKeyPair } from 'jose';

// generate keys for encryption and signing
const { publicKey: encPublic, privateKey: encPrivate } = await generateKeyPair('RSA-OAEP-256');
const { publicKey: signPublic, privateKey: signPrivate } = await generateKeyPair('RS512');

// generate a unique key Id
const encKeyId = `enc-${new Date().toISOString()}`;
const signKeyId = `sign-${new Date().toISOString()}`;

console.log(`ENC_PUBLIC_KEY="${(await exportSPKI(encPublic)).trim()}"`);
console.log(`ENC_PRIVATE_KEY="${(await exportPKCS8(encPrivate)).trim()}"`);
console.log(`ENC_KID="${encKeyId}"`);

console.log(`SIGN_PRIVATE_KEY="${(await exportPKCS8(signPrivate)).trim()}"`);
console.log(`SIGN_PUBLIC_KEY="${(await exportSPKI(signPublic)).trim()}"`);
console.log(`SIGN_KID="${signKeyId}"`);
