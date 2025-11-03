'use client';

import { usePathname } from 'next/navigation';
import WebchatEmbed from './WebchatEmbed';

/**
 * Wrapper per il widget floating della webchat
 * Si mostra su tutte le pagine tranne quelle specificate
 */
export default function WebchatWidget() {
  const pathname = usePathname();
  
  // Nascondi il widget su queste pagine (perché hanno già l'embed completo)
  const hideOnPages = ['/contact', '/admin'];
  
  // Nascondi su pagine admin e sulla pagina contact (ha già l'embed full)
  const shouldHide = hideOnPages.some(page => pathname?.startsWith(page));
  
  if (shouldHide) {
    return null;
  }
  
  return <WebchatEmbed />;
}
