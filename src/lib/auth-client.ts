'use client';

export async function isUserAdmin(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user?.role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error('Errore verifica admin:', error);
    return false;
  }
}