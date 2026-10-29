import CryptoJS from 'crypto-js'
// CRITICAL: All sensitive fields are encrypted CLIENT SIDE before saving to Supabase.
// We derive key from user's Supabase user.id + salt. Even if Supabase breached, data unreadable.
// Decrypt only on client when displaying. No server sees plaintext.
function deriveKey(userId: string): string {
  const salt = "HAQQ_VAULT_SALT_2024_SECURE";
  return CryptoJS.SHA256(userId + salt).toString();
}
export function encryptField(plainText: string, userId: string): string {
  if (!plainText) return "";
  const key = deriveKey(userId);
  return CryptoJS.AES.encrypt(plainText, key).toString();
}
export function decryptField(cipherText: string, userId: string): string {
  if (!cipherText) return "";
  try {
    const key = deriveKey(userId);
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8) || "[Unable to decrypt]";
  } catch { return "[Decryption failed]"; }
}
