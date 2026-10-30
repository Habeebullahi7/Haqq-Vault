import CryptoJS from 'crypto-js'

function deriveKey(userId: string): string {
  const salt = "HAQQ_VAULT_SALT_2024_SECURE"
  return CryptoJS.SHA256(userId + salt).toString()
}

export function encryptField(plain: string, userId: string): string {
  if (!plain) return ""
  return CryptoJS.AES.encrypt(plain, deriveKey(userId)).toString()
}

export function decryptField(cipher: string, userId: string): string {
  if (!cipher) return ""
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, deriveKey(userId))
    return bytes.toString(CryptoJS.enc.Utf8) || "[Unable]"
  } catch { 
    return "[Failed]" 
  }
}
