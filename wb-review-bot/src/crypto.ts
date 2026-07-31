import type { Env } from './types';

// AES-256-GCM поверх WebCrypto. Ключ — 32 байта base64 из Workers Secrets.
// Формат шифртекста: base64( iv[12] || ciphertext+tag ). Новый IV на каждое шифрование.

const IV_BYTES = 12;

function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64encode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

async function importKey(env: Env): Promise<CryptoKey> {
  const raw = b64decode(env.ENCRYPTION_KEY);
  if (raw.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 bytes (base64-encoded)');
  }
  return crypto.subtle.importKey('raw', raw.buffer as ArrayBuffer, 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptSecret(env: Env, plaintext: string): Promise<string> {
  const key = await importKey(env);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  const packed = new Uint8Array(IV_BYTES + ciphertext.byteLength);
  packed.set(iv, 0);
  packed.set(new Uint8Array(ciphertext), IV_BYTES);
  return b64encode(packed);
}

export async function decryptSecret(env: Env, payload: string): Promise<string> {
  const key = await importKey(env);
  const packed = b64decode(payload);
  const iv = packed.slice(0, IV_BYTES);
  const ciphertext = packed.slice(IV_BYTES);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext.buffer as ArrayBuffer
  );
  return new TextDecoder().decode(plaintext);
}
