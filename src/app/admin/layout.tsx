'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  BarChart3, 
  Wrench, 
  Lock, 
  TrendingUp, 
  Settings, 
  LogOut,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Controlla se c'è un token JWT valido
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        // Token non valido o scaduto, reindirizza al login
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

    const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout-simple', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Caricamento pannello amministratore...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Il redirect è gestito in checkAuth
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 bg-gray-800">
            <Shield className="w-6 h-6 text-yellow-500 mr-2" />
            <h1 className="text-xl font-bold text-yellow-500">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition"
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            
            <Link 
              href="/admin/projects" 
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition"
            >
              <Wrench className="w-5 h-5 mr-3" />
              Progetti
            </Link>

            <Link 
              href="/admin/security" 
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition"
            >
              <Lock className="w-5 h-5 mr-3" />
              Sicurezza
            </Link>

            <Link 
              href="/admin/analytics" 
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Analytics
            </Link>

            <Link 
              href="/admin/settings" 
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition"
            >
              <Settings className="w-5 h-5 mr-3" />
              Impostazioni
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">
                {user?.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-red-800 hover:text-white transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
                {/* Main Content */}
        <main className="min-h-screen overflow-y-auto bg-gray-900">
          {/* 2FA Reminder Banner */}
          {user && !user.twoFactorEnabled && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 m-6 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-yellow-800 font-medium">Sicurezza Account</p>
                    <p className="text-yellow-700 text-sm">
                      Configura l'autenticazione a due fattori per proteggere il tuo account amministratore
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/auth/enable-2fa', {
                          method: 'POST',
                          credentials: 'include'
                        });
                        const data = await response.json();
                        if (data.success) {
                          window.location.href = '/login/setup-2fa';
                        } else {
                          console.error('Failed to enable 2FA setup:', data.error);
                        }
                      } catch (error) {
                        console.error('Error enabling 2FA:', error);
                      }
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Configura Ora
                  </button>
                  <button className="text-yellow-600 hover:text-yellow-800 px-3 py-2 text-sm font-medium">
                    Ricorda Dopo
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}