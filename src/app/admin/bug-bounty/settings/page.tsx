'use client';

import { useState, useEffect } from 'react';
import { 
  Settings,
  Shield,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in hours
  platforms: PlatformConfig[];
  lastSync: string | null;
  nextSync: string | null;
}

interface PlatformConfig {
  id: string;
  name: string;
  username: string;
  enabled: boolean;
  apiKey?: string;
  syncStrategy: 'scraping' | 'api' | 'manual';
  rateLimit: number; // requests per hour
  lastSync: string | null;
  status: 'active' | 'error' | 'pending';
}

export default function BugBountySettingsPage() {
  const [settings, setSettings] = useState<SyncSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [newPlatform, setNewPlatform] = useState({
    name: '',
    username: '',
    syncStrategy: 'scraping' as const
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load sync configuration
      const response = await fetch('/api/bug-bounty/sync-platforms');
      if (response.ok) {
        const data = await response.json();
        
        // Mock settings structure for demo
        const mockSettings: SyncSettings = {
          autoSync: true,
          syncInterval: 24, // 24 hours
          platforms: data.platforms.map((p: any) => ({
            id: p.id,
            name: p.name,
            username: p.username,
            enabled: p.active,
            syncStrategy: 'scraping' as const,
            rateLimit: 10, // 10 requests per hour
            lastSync: p.lastActive,
            status: p.active ? 'active' as const : 'pending' as const
          })),
          lastSync: data.lastUpdate,
          nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        setSettings(mockSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      
      // Save settings to backend
      const response = await fetch('/api/bug-bounty/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addPlatform = () => {
    if (!settings || !newPlatform.name || !newPlatform.username) return;
    
    const platform: PlatformConfig = {
      id: Date.now().toString(),
      name: newPlatform.name,
      username: newPlatform.username,
      enabled: true,
      syncStrategy: newPlatform.syncStrategy,
      rateLimit: 10,
      lastSync: null,
      status: 'pending'
    };
    
    setSettings({
      ...settings,
      platforms: [...settings.platforms, platform]
    });
    
    setNewPlatform({ name: '', username: '', syncStrategy: 'scraping' });
  };

  const removePlatform = (platformId: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      platforms: settings.platforms.filter(p => p.id !== platformId)
    });
  };

  const togglePlatform = (platformId: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      platforms: settings.platforms.map(p => 
        p.id === platformId ? { ...p, enabled: !p.enabled } : p
      )
    });
  };

  const toggleApiKeyVisibility = (platformId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Caricamento impostazioni...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Errore nel caricamento delle impostazioni</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Bug Bounty Settings</h1>
              <p className="text-gray-400">Configura sincronizzazione e piattaforme</p>
            </div>
          </div>
          
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
            {saving ? 'Salvando...' : 'Salva Impostazioni'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Impostazioni Generali
            </h2>

            <div className="space-y-6">
              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Auto Sync</h3>
                  <p className="text-gray-400 text-sm">Sincronizzazione automatica periodica</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoSync: !settings.autoSync })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoSync ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoSync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sync Interval */}
              <div>
                <label className="block text-white font-medium mb-2">Intervallo Sync (ore)</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.syncInterval}
                  onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                />
              </div>

              {/* Sync Status */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-white font-medium mb-3">Stato Sincronizzazione</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ultimo Sync:</span>
                    <span className="text-white">
                      {settings.lastSync ? new Date(settings.lastSync).toLocaleString('it-IT') : 'Mai'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prossimo Sync:</span>
                    <span className="text-white">
                      {settings.nextSync ? new Date(settings.nextSync).toLocaleString('it-IT') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-green-400" />
              Configurazione Piattaforme
            </h2>

            {/* Add New Platform */}
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-4">Aggiungi Nuova Piattaforma</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nome piattaforma"
                  value={newPlatform.name}
                  onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newPlatform.username}
                  onChange={(e) => setNewPlatform({ ...newPlatform, username: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                />
                <select
                  value={newPlatform.syncStrategy}
                  onChange={(e) => setNewPlatform({ ...newPlatform, syncStrategy: e.target.value as any })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                >
                  <option value="scraping">Web Scraping</option>
                  <option value="api">API (se disponibile)</option>
                  <option value="manual">Manuale</option>
                </select>
                <button
                  onClick={addPlatform}
                  disabled={!newPlatform.name || !newPlatform.username}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi
                </button>
              </div>
            </div>

            {/* Platform List */}
            <div className="space-y-4">
              {settings.platforms.map((platform) => (
                <div key={platform.id} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlatform(platform.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          platform.enabled ? 'bg-green-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            platform.enabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <h3 className="text-white font-medium">{platform.name}</h3>
                      <div className={`flex items-center gap-1 ${getStatusColor(platform.status)}`}>
                        {getStatusIcon(platform.status)}
                        <span className="text-sm capitalize">{platform.status}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removePlatform(platform.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Username:</span>
                      <p className="text-white">{platform.username}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Strategia:</span>
                      <p className="text-white capitalize">{platform.syncStrategy}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rate Limit:</span>
                      <p className="text-white">{platform.rateLimit}/h</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Ultimo Sync:</span>
                      <p className="text-white">
                        {platform.lastSync ? new Date(platform.lastSync).toLocaleDateString('it-IT') : 'Mai'}
                      </p>
                    </div>
                  </div>

                  {/* API Key field (if needed) */}
                  {platform.syncStrategy === 'api' && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <label className="block text-gray-400 text-sm mb-2">API Key (opzionale):</label>
                      <div className="flex gap-2">
                        <input
                          type={showApiKeys[platform.id] ? 'text' : 'password'}
                          placeholder="API Key..."
                          value={platform.apiKey || ''}
                          onChange={(e) => {
                            const updatedPlatforms = settings.platforms.map(p =>
                              p.id === platform.id ? { ...p, apiKey: e.target.value } : p
                            );
                            setSettings({ ...settings, platforms: updatedPlatforms });
                          }}
                          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                        />
                        <button
                          onClick={() => toggleApiKeyVisibility(platform.id)}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          {showApiKeys[platform.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h3 className="text-blue-300 font-medium mb-2">Note Importanti</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Solo i dati pubblici dei profili vengono sincronizzati</li>
              <li>• Il web scraping rispetta i rate limits e i termini di servizio</li>
              <li>• Le API keys sono opzionali e utilizzate solo se disponibili</li>
              <li>• I dati vengono cached per ridurre le richieste alle piattaforme</li>
              <li>• La sincronizzazione automatica può essere disabilitata in qualsiasi momento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}