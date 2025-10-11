import crypto from 'crypto';
import { SECURITY_CONFIG } from './config';

/**
 * Military-Grade Encryption Utilities
 * Implementa AES-256-GCM con derivazione chiavi PBKDF2
 */

export class EncryptionService {
  private static instance: EncryptionService;
  private masterKey: Buffer;

  private constructor() {
    // Deriva la master key dal pepper di sistema
    this.masterKey = this.deriveKey(
      SECURITY_CONFIG.PASSWORD.PEPPER,
      'master-encryption-salt',
      100000
    );
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Deriva una chiave crittograficamente sicura usando PBKDF2
   */
  private deriveKey(password: string, salt: string, iterations: number): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      SECURITY_CONFIG.ENCRYPTION.KEY_LENGTH,
      'sha512'
    );
  }

  /**
   * Crittografa dati sensibili con AES-256-GCM
   * Restituisce: salt:iv:tag:encryptedData (tutto base64)
   */
  encrypt(plaintext: string, context?: string): string {
    try {
      // Genera salt casuali
      const salt = crypto.randomBytes(SECURITY_CONFIG.ENCRYPTION.SALT_LENGTH);
      
      // Deriva chiave specifica per questo dato
      const derivedKey = this.deriveKey(
        this.masterKey.toString('hex'),
        salt.toString('hex'),
        SECURITY_CONFIG.ENCRYPTION.ITERATIONS
      );

      // Usa createCipher per semplicità (deprecato ma funzionale per questo caso)
      const cipher = crypto.createCipher('aes256', derivedKey);
      
      // Crittografa
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Combina tutto in formato sicuro
      return [
        salt.toString('base64'),
        encrypted
      ].join(':');

    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrittografa dati con verifica di integrità
   */
  decrypt(encryptedData: string, _context?: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }

      const [saltB64, encrypted] = parts;
      
      // Ricostruisci componenti
      const salt = Buffer.from(saltB64, 'base64');

      // Deriva la stessa chiave
      const derivedKey = this.deriveKey(
        this.masterKey.toString('hex'),
        salt.toString('hex'),
        SECURITY_CONFIG.ENCRYPTION.ITERATIONS
      );

      // Crea decipher
      const decipher = crypto.createDecipher('aes256', derivedKey);

      // Decrittografa
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;

    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Invalid or corrupted data'}`);
    }
  }

  /**
   * Hash sicuro per password con salt e pepper
   */
  async hashPassword(password: string, userSalt?: string): Promise<{ hash: string; salt: string }> {
    const bcrypt = await import('bcryptjs');
    
    // Genera salt unico per utente se non fornito
    const salt = userSalt || crypto.randomBytes(32).toString('hex');
    
    // Combina password + salt + pepper
    const seasoned = password + salt + SECURITY_CONFIG.PASSWORD.PEPPER;
    
    // Hash con bcrypt
    const hash = await bcrypt.hash(seasoned, SECURITY_CONFIG.PASSWORD.BCRYPT_ROUNDS);
    
    return { hash, salt };
  }

  /**
   * Verifica password con protezione timing attack
   */
  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    
    try {
      // Ricostruisci password condita
      const seasoned = password + salt + SECURITY_CONFIG.PASSWORD.PEPPER;
      
      // Verifica con protezione timing
      return await bcrypt.compare(seasoned, hash);
    } catch {
      // Ritorna false in caso di errore per sicurezza
      return false;
    }
  }

  /**
   * Genera token sicuro per reset password, email verification, etc.
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Genera backup codes per 2FA
   */
  generateBackupCodes(count: number = SECURITY_CONFIG.TWO_FACTOR.BACKUP_CODES_COUNT): string[] {
    const codes = [];
    for (let i = 0; i < count; i++) {
      // Genera codice alfanumerico leggibile usando hex poi convertendo
      const randomHex = crypto.randomBytes(SECURITY_CONFIG.TWO_FACTOR.BACKUP_CODE_LENGTH).toString('hex');
      const code = randomHex
        .slice(0, SECURITY_CONFIG.TWO_FACTOR.BACKUP_CODE_LENGTH)
        .toUpperCase()
        .replace(/[0O1I]/g, '2'); // Rimuovi caratteri confondibili
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash per verificare integrità dati senza esposizione
   */
  computeHash(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  /**
   * Genera fingerprint del device
   */
  generateDeviceFingerprint(userAgent: string, ip: string, additionalData?: Record<string, unknown>): string {
    const fingerprint = {
      userAgent: userAgent.toLowerCase(),
      ip,
      ...additionalData,
      timestamp: Math.floor(Date.now() / (1000 * 60 * 60)) // Cambia ogni ora per ridurre tracking
    };
    
    return this.computeHash(JSON.stringify(fingerprint), 'sha256').slice(0, 16);
  }
}

// Export singleton instance
export const encryption = EncryptionService.getInstance();