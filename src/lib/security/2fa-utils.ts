/**
 * Genera un secret casuale per 2FA (versione semplificata per test)
 */
export function generateSecret(): string {
  // Per ora, genera un secret mock per test
  return 'JBSWY3DPEHPK3PXP'; // Base32 encoded secret per test
}

/**
 * Genera un QR code URL per l'app authenticator (mock per test)
 */
export async function generateQRCode(secret: string, email: string, service: string = 'Portfolio'): Promise<string> {
  // Per test, restituisce un placeholder QR code data URL
  const otpauthUrl = `otpauth://totp/${service}:${email}?secret=${secret}&issuer=${service}`;
  
  // Mock QR code - in produzione userai una libreria come qrcode
  const mockQRCode = `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code Mock</text>
      <text x="100" y="90" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">Secret: ${secret}</text>
      <text x="100" y="110" text-anchor="middle" font-family="Arial" font-size="8" fill="gray">Use in authenticator app</text>
      <text x="100" y="135" text-anchor="middle" font-family="Arial" font-size="10" fill="red">Demo Codes:</text>
      <text x="100" y="155" text-anchor="middle" font-family="Arial" font-size="12" fill="red">123456 | 12345 | 000000</text>
    </svg>
  `)}`;
  
  return mockQRCode;
}

/**
 * Verifica un token TOTP (versione semplificata per test)
 */
export function verifyToken(token: string, secret: string): boolean {
  // Per test, accetta codici demo: 123456, 12345, o 000000
  const validCodes = ['123456', '12345', '000000'];
  return validCodes.includes(token);
}

/**
 * Genera codici di backup casuali
 */
export function generateBackupCodes(count: number = 8): string[] {
  return Array.from({ length: count }, () => 
    Math.random().toString(36).substr(2, 8).toUpperCase()
  );
}