/**
 * Iframe Communication Utility
 * 
 * Provides secure, type-safe communication between parent window and iframe
 * using the postMessage API to avoid CORS issues.
 */

// Message types that can be sent from iframe to parent
export type IframeToParentMessage =
  | { type: 'iframe_ready' }
  | { type: 'iframe_loaded' }
  | { type: 'auth_success'; payload: { userId: string; username: string } }
  | { type: 'auth_error'; payload: { error: string; code?: string } }
  | { type: 'resize'; payload: { height: number; width?: number } }
  | { type: 'error'; payload: { message: string; details?: unknown } }
  | { type: 'user_joined'; payload: { username: string } }
  | { type: 'user_left'; payload: { username: string } }
  | { type: 'connection_status'; payload: { status: 'connected' | 'disconnected' | 'reconnecting' } };

// Message types that can be sent from parent to iframe
export type ParentToIframeMessage =
  | { type: 'init'; payload: { config?: Record<string, unknown> } }
  | { type: 'set_theme'; payload: { theme: 'light' | 'dark' } }
  | { type: 'set_token'; payload: { token: string } };

// Combined message type
export type PostMessageData = IframeToParentMessage | ParentToIframeMessage;

// Event handler type for received messages
export type MessageHandler<T extends PostMessageData = PostMessageData> = (
  message: T,
  event: MessageEvent
) => void;

/**
 * Class to manage iframe communication with postMessage API
 */
export class IframeMessenger {
  private iframeRef: HTMLIFrameElement | null = null;
  private allowedOrigins: string[];
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private isInitialized = false;

  constructor(allowedOrigins: string[]) {
    this.allowedOrigins = allowedOrigins;
  }

  /**
   * Initialize the messenger with an iframe element
   */
  init(iframeElement: HTMLIFrameElement) {
    if (this.isInitialized) {
      console.warn('[IframeMessenger] Already initialized');
      return;
    }

    this.iframeRef = iframeElement;
    this.isInitialized = true;

    // Listen for messages from iframe
    window.addEventListener('message', this.handleMessage);

    console.log('[IframeMessenger] Initialized with allowed origins:', this.allowedOrigins);
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.messageHandlers.clear();
    this.iframeRef = null;
    this.isInitialized = false;
    console.log('[IframeMessenger] Destroyed');
  }

  /**
   * Send a message to the iframe
   */
  sendToIframe<T extends ParentToIframeMessage>(message: T) {
    if (!this.iframeRef?.contentWindow) {
      console.warn('[IframeMessenger] Cannot send message: iframe not ready');
      return;
    }

    // Send to the first allowed origin (should be the iframe's origin)
    const targetOrigin = this.allowedOrigins[0] || '*';
    
    try {
      this.iframeRef.contentWindow.postMessage(message, targetOrigin);
      console.log('[IframeMessenger] Sent to iframe:', message.type);
    } catch (error) {
      console.error('[IframeMessenger] Error sending message:', error);
    }
  }

  /**
   * Register a handler for a specific message type
   */
  on<K extends PostMessageData['type']>(
    messageType: K,
    handler: MessageHandler<Extract<PostMessageData, { type: K }>>
  ) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler as MessageHandler);
    console.log('[IframeMessenger] Registered handler for:', messageType);
  }

  /**
   * Unregister a handler for a specific message type
   */
  off<K extends PostMessageData['type']>(
    messageType: K,
    handler: MessageHandler<Extract<PostMessageData, { type: K }>>
  ) {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler as MessageHandler);
      if (index > -1) {
        handlers.splice(index, 1);
        console.log('[IframeMessenger] Unregistered handler for:', messageType);
      }
    }
  }

  /**
   * Handle incoming messages from iframe
   */
  private handleMessage = (event: MessageEvent) => {
    // Verify origin
    if (!this.isOriginAllowed(event.origin)) {
      console.warn('[IframeMessenger] Message from unauthorized origin:', event.origin);
      return;
    }

    // Verify message structure
    const message = event.data as PostMessageData;
    if (!message || typeof message !== 'object' || !message.type) {
      return;
    }

    console.log('[IframeMessenger] Received message:', message.type, message);

    // Call registered handlers for this message type
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message, event);
        } catch (error) {
          console.error('[IframeMessenger] Error in message handler:', error);
        }
      });
    }
  };

  /**
   * Check if origin is in the allowed list
   */
  private isOriginAllowed(origin: string): boolean {
    // Allow any origin if wildcard is specified
    if (this.allowedOrigins.includes('*')) {
      return true;
    }

    return this.allowedOrigins.some(allowed => {
      // Exact match
      if (allowed === origin) return true;

      // Wildcard subdomain match (e.g., *.example.com)
      if (allowed.startsWith('*.')) {
        const domain = allowed.slice(2);
        return origin.endsWith(domain);
      }

      return false;
    });
  }
}

/**
 * React hook for using IframeMessenger
 */
export function useIframeMessenger(allowedOrigins: string[]) {
  const messengerRef = React.useRef<IframeMessenger | null>(null);

  React.useEffect(() => {
    // Create messenger instance
    if (!messengerRef.current) {
      messengerRef.current = new IframeMessenger(allowedOrigins);
    }

    // Cleanup on unmount
    return () => {
      messengerRef.current?.destroy();
      messengerRef.current = null;
    };
  }, [allowedOrigins]);

  return messengerRef.current;
}

// Import React for the hook
import React from 'react';
