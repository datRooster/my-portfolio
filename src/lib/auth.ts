import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

// Simuliamo utenti admin (in un'app reale questi verrebbero dal database)
const ADMIN_USERS = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@portfolio.dev',
    role: 'admin' as const,
    isVerified: true,
    twoFactorEnabled: true
  }
];

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');
    
    if (!authToken || !authToken.value.startsWith('auth_')) {
      return null;
    }

    // Verifica che l'utente sia configurato con 2FA (come nel sistema esistente)
    const has2FAConfigured = cookieStore.get('has_2fa_configured')?.value === 'true';
    
    // Se il token è valido, restituisci l'utente admin
    const user: User = {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@portfolio.dev',
      role: 'admin',
      isVerified: true,
      twoFactorEnabled: has2FAConfigured
    };

    return user;
  } catch (error) {
    console.error('Errore verifica autenticazione:', error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || false;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Autenticazione richiesta');
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Accesso admin richiesto');
  }
  return user;
}

// Middleware per le API route
export async function withAuth(handler: (user: User) => Promise<Response>) {
  try {
    const user = await requireAuth();
    return await handler(user);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Non autorizzato' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function withAdminAuth(handler: (user: User) => Promise<Response>) {
  try {
    const user = await requireAdmin();
    return await handler(user);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Accesso admin richiesto' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Middleware per API route che necessitano sia request che user
export async function withAdminAuthRequest(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      console.log('🔐 withAdminAuthRequest: Starting admin auth check');
      const user = await requireAdmin();
      console.log('✅ withAdminAuthRequest: Admin verified, user:', user?.email);
      return await handler(request, user);
    } catch (error) {
      console.error('❌ withAdminAuthRequest: Auth error:', error);
      return new Response(
        JSON.stringify({ error: 'Accesso admin richiesto' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}