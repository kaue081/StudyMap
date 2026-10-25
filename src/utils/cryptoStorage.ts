/**
 * Utilitário Front-end de Criptografia para LocalStorage do StudyMap.
 * Criptografa todos os payloads JSON antes de persistir no navegador (IV aleatório de 96 bits +
 * cifra de fluxo autenticada por MAC de 64 bits + codificação Base64) e permite limpeza total no Logout.
 */

const CIPHER_PREFIX = "SMENC.v1.";
const APP_SECRET = "StudyMap::2DSA::EncryptedLocalStorageKey::2026";

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const parsed = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(parsed)) return null;
    out[i] = parsed;
  }
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...sub);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array | null {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Gerador determinístico de fluxo pseudoaleatório de 32 bits (SplitMix32-like)
 * combinado com o segredo da aplicação e o IV aleatório da mensagem.
 */
function mix32(h: number): number {
  let x = h | 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return (x ^ (x >>> 16)) >>> 0;
}

function deriveSeeds(iv: Uint8Array): [number, number] {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;

  for (let i = 0; i < APP_SECRET.length; i++) {
    const code = APP_SECRET.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193) >>> 0;
    h2 = mix32(h2 ^ (code + i * 31));
  }

  for (let i = 0; i < iv.length; i++) {
    h1 = mix32(h1 ^ (iv[i] + i * 17));
    h2 = Math.imul(h2 ^ iv[i], 0x85ebca6b) >>> 0;
  }

  return [h1 >>> 0, h2 >>> 0];
}

function xorKeystream(input: Uint8Array, iv: Uint8Array): Uint8Array {
  const [seedA, seedB] = deriveSeeds(iv);
  const output = new Uint8Array(input.length);
  let stateA = seedA;
  let stateB = seedB;

  for (let i = 0; i < input.length; i++) {
    stateA = (stateA + 0x9e3779b9) >>> 0;
    stateB = mix32(stateB ^ stateA ^ i);
    const keyByte = (mix32(stateA ^ stateB) >>> ((i & 3) * 8)) & 0xff;
    output[i] = input[i] ^ keyByte;
  }

  return output;
}

function computeMacHex(iv: Uint8Array, cipherBytes: Uint8Array): string {
  const [seedA, seedB] = deriveSeeds(iv);
  let mac1 = mix32(seedA ^ 0xa5a5a5a5);
  let mac2 = mix32(seedB ^ 0x5a5a5a5a);

  for (let i = 0; i < cipherBytes.length; i++) {
    const b = cipherBytes[i];
    mac1 = mix32(mac1 ^ (b + ((i & 0xff) << 8)));
    mac2 = mix32(mac2 ^ Math.imul(b ^ 0x5c, i + 1));
  }

  const macBytes = new Uint8Array(8);
  const view = new DataView(macBytes.buffer);
  view.setUint32(0, mac1, false);
  view.setUint32(4, mac2, false);
  return bytesToHex(macBytes);
}

function generateRandomIv(): Uint8Array {
  const iv = new Uint8Array(12);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(iv);
  } else {
    for (let i = 0; i < iv.length; i++) {
      iv[i] = Math.floor(Math.random() * 256);
    }
  }
  return iv;
}

export function encryptData(value: unknown): string {
  const json = JSON.stringify(value);
  const plainBytes = new TextEncoder().encode(json);
  const iv = generateRandomIv();
  const cipherBytes = xorKeystream(plainBytes, iv);
  const macHex = computeMacHex(iv, cipherBytes);
  const payloadBase64 = bytesToBase64(cipherBytes);

  return `${CIPHER_PREFIX}${bytesToHex(iv)}.${macHex}.${payloadBase64}`;
}

export function decryptData<T>(raw: string): T | null {
  if (!raw.startsWith(CIPHER_PREFIX)) {
    // Compatibilidade de migração caso exista dado legado não criptografado
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  const body = raw.slice(CIPHER_PREFIX.length);
  const parts = body.split(".");
  if (parts.length !== 3) return null;

  const [ivHex, macHex, payloadBase64] = parts;
  const iv = hexToBytes(ivHex);
  const cipherBytes = base64ToBytes(payloadBase64);
  if (!iv || !cipherBytes) return null;

  const expectedMac = computeMacHex(iv, cipherBytes);
  if (expectedMac !== macHex) {
    console.warn("Falha na verificação de integridade dos dados criptografados no LocalStorage.");
    return null;
  }

  try {
    const plainBytes = xorKeystream(cipherBytes, iv);
    const json = new TextDecoder().decode(plainBytes);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getEncryptedItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const decrypted = decryptData<T>(stored);
    return decrypted !== null ? decrypted : fallback;
  } catch (error) {
    console.error(`Erro ao ler chave criptografada "${key}":`, error);
    return fallback;
  }
}

export function setEncryptedItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Erro ao criptografar e salvar chave "${key}":`, error);
  }
}

export function clearAllLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Erro ao limpar o LocalStorage:", error);
  }
}

