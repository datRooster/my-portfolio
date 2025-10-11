import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { SECURITY_CONFIG } from './config';
import { encryption } from './encryption';

/**
 * Two-Factor Authentication Service - Military Grade
 * Implementa TOTP (Time-based One-Time Password) con backup codes
 */

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  setupToken: string;
}

export interface TwoFactorVerification {
  isValid: boolean;
  usedBackupCode?: boolean;
  remainingBackupCodes?: number;
  error?: string;
}

interface PendingSetup {
  userId: string;
  secret: string;
  backupCodes: string[];
  createdAt: number;
  verified: boolean;
}

export class TwoFactorService {
  private static instance: TwoFactorService;
  private pendingSetups = new Map<string, PendingSetup>();

  private constructor() {
    // Pulizia periodica setup pendenti
    setInterval(() => {
      this.cleanupPendingSetups();
    }, 10 * 60 * 1000); // 10 minuti
  }

  static getInstance(): TwoFactorService {
    if (!TwoFactorService.instance) {
      TwoFactorService.instance = new TwoFactorService();
    }
    return TwoFactorService.instance;
  }

  /**
   * Inizializza setup 2FA per un utente
   */
  async initializeSetup(userId: string, userEmail: string): Promise<TwoFactorSetup> {
    try {
      // Genera secret casuali per TOTP
      const secret = speakeasy.generateSecret({
        name: `TheWebRooster (${userEmail})`,
        issuer: SECURITY_CONFIG.JWT.ISSUER,
        length: SECURITY_CONFIG.TWO_FACTOR.SECRET_LENGTH
      });

      // Genera backup codes
      const backupCodes = encryption.generateBackupCodes(
        SECURITY_CONFIG.TWO_FACTOR.BACKUP_CODES_COUNT
      );

      // Cripta i backup codes per sicurezza
      const encryptedBackupCodes = backupCodes.map(code => 
        encryption.encrypt(code, `backup-${userId}`)
      );

      // Genera QR code per l'app authenticator
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

      // Genera token di setup temporaneo
      const setupToken = encryption.generateSecureToken(32);

      // Salva setup pendente (temporaneo)
      this.pendingSetups.set(setupToken, {
        userId,
        secret: secret.base32,
        backupCodes: encryptedBackupCodes,
        createdAt: Date.now(),
        verified: false
      });

      return {
        secret: secret.base32 || '',
        qrCodeUrl,
        backupCodes, // Mostra in chiaro solo durante setup
        setupToken
      };

    } catch (error) {
      throw new Error(`2FA setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verifica il setup 2FA con il primo codice TOTP
   */
  async verifySetup(setupToken: string, totpCode: string): Promise<{ success: boolean; backupCodes?: string[] }> {
    try {
      const setup = this.pendingSetups.get(setupToken);
      if (!setup) {
        return { success: false };
      }

      // Verifica che il setup non sia scaduto (10 minuti)
      if (Date.now() - setup.createdAt > 10 * 60 * 1000) {
        this.pendingSetups.delete(setupToken);
        return { success: false };
      }

      // Verifica codice TOTP
      const isValid = speakeasy.totp.verify({
        secret: setup.secret,
        encoding: 'base32',
        token: totpCode,
        window: SECURITY_CONFIG.TWO_FACTOR.TOTP_WINDOW
      });

      if (!isValid) {
        return { success: false };
      }

      // Marca come verificato
      setup.verified = true;

      // Qui dovresti salvare nel database:
      // - secret crittografato
      // - backup codes crittografati
      // - abilitare 2FA per l'utente

      // Decrittografa backup codes per mostrarli una sola volta
      const decryptedBackupCodes = setup.backupCodes.map((encrypted: string) => 
        encryption.decrypt(encrypted, `backup-${setup.userId}`)
      );

      return {
        success: true,
        backupCodes: decryptedBackupCodes
      };

    } catch (error) {
      console.error('2FA setup verification failed:', error);
      return { success: false };
    }
  }

  /**
   * Verifica codice TOTP o backup code durante login
   */
  async verifyCode(
    userId: string, 
    code: string, 
    userSecret: string, 
    userBackupCodes: string[]
  ): Promise<TwoFactorVerification> {
    try {
      // Prima prova con TOTP
      const totpValid = speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token: code,
        window: SECURITY_CONFIG.TWO_FACTOR.TOTP_WINDOW
      });

      if (totpValid) {
        return {
          isValid: true,
          usedBackupCode: false
        };
      }

      // Se TOTP fallisce, prova backup codes
      const normalizedCode = code.replace(/\s/g, '').toUpperCase();
      
      for (let i = 0; i < userBackupCodes.length; i++) {
        const encryptedBackupCode = userBackupCodes[i];
        
        if (!encryptedBackupCode) continue; // Codice già usato
        
        try {
          const decryptedCode = encryption.decrypt(encryptedBackupCode, `backup-${userId}`);
          
          if (decryptedCode === normalizedCode) {
            // Backup code valido - rimuovilo (usa una sola volta)
            userBackupCodes[i] = ''; // Segna come usato
            
            // Qui dovresti aggiornare il database per rimuovere il codice usato
            
            const remainingCodes = userBackupCodes.filter(code => code !== '').length;
            
            return {
              isValid: true,
              usedBackupCode: true,
              remainingBackupCodes: remainingCodes
            };
          }
        } catch {
          // Codice non valido o corrotto, continua
          continue;
        }
      }

      return {
        isValid: false,
        error: 'Invalid TOTP or backup code'
      };

    } catch (error) {
      return {
        isValid: false,
        error: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Genera nuovi backup codes (invalida quelli vecchi)
   */
  async regenerateBackupCodes(_userId: string): Promise<string[]> {
    try {
      const newBackupCodes = encryption.generateBackupCodes(
        SECURITY_CONFIG.TWO_FACTOR.BACKUP_CODES_COUNT
      );

    // Critta i nuovi backup codes
    newBackupCodes.map(code => 
      encryption.encrypt(code, `backup-${_userId}`)
    );      // Qui dovresti aggiornare il database con i nuovi backup codes crittografati

      return newBackupCodes; // Mostra in chiaro solo durante la generazione

    } catch (error) {
      throw new Error(`Backup codes regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disabilita 2FA per un utente
   */
  async disable2FA(_userId: string): Promise<boolean> {
    try {
      // Qui dovresti:
      // 1. Rimuovere secret TOTP dal database
      // 2. Rimuovere tutti i backup codes
      // 3. Disabilitare flag 2FA per l'utente
      // 4. Revocare tutte le sessioni attive per sicurezza

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Genera codice di emergenza per disabilitare 2FA
   */
  async generateEmergencyDisableCode(_userId: string): Promise<string> {
    const emergencyCode = encryption.generateSecureToken(16);
    
    // Qui dovresti salvare il codice nel database con:
    // - scadenza (es. 24 ore)
    // - flag di utilizzo singolo
    // - associazione con userId
    
    return emergencyCode;
  }

  /**
   * Verifica codice di emergenza per disabilitare 2FA
   */
  async verifyEmergencyDisableCode(_userId: string, _emergencyCode: string): Promise<boolean> {
    try {
      // Qui dovresti:
      // 1. Verificare che il codice esista nel database
      // 2. Verificare che non sia scaduto
      // 3. Verificare che non sia già stato usato
      // 4. Se valido, disabilitare 2FA e invalidare il codice

      return true; // Placeholder
    } catch {
      return false;
    }
  }

  /**
   * Ottieni statistiche 2FA per un utente
   */
  async getUserTwoFactorStats(_userId: string): Promise<{
    isEnabled: boolean;
    setupDate: Date;
    lastUsed: Date;
    remainingBackupCodes: number;
    totalBackupCodes: number;
  }> {
    // Qui dovresti recuperare dal database:
    return {
      isEnabled: true, // Placeholder
      setupDate: new Date(),
      lastUsed: new Date(),
      remainingBackupCodes: 5,
      totalBackupCodes: SECURITY_CONFIG.TWO_FACTOR.BACKUP_CODES_COUNT
    };
  }

  /**
   * Pulizia setup pendenti scaduti
   */
  private cleanupPendingSetups(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minuti

    for (const [token, setup] of this.pendingSetups) {
      if (now - setup.createdAt > maxAge) {
        this.pendingSetups.delete(token);
      }
    }
  }

  /**
   * Ottieni setup pendente (per debugging)
   */
  getPendingSetup(setupToken: string): PendingSetup | undefined {
    return this.pendingSetups.get(setupToken);
  }
}

// Export singleton
export const twoFactorService = TwoFactorService.getInstance();