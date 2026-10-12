import { useVisitorStats } from '@/lib/visitors';

import { useState } from 'react';

import { Eye,TrendingUp,Users } from 'lucide-react';


interface VisitorCounterProps {
  className?: string;
  variant?: 'minimal' | 'detailed' | 'floating';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function VisitorCounter({ 
  className = '', 
  variant = 'minimal',
  position = 'bottom-right' 
}: VisitorCounterProps) {
  const stats = useVisitorStats();
  const [isVisible, setIsVisible] = useState(true);

  if (!stats) {
    return null; // Caricamento silenzioso
  }

  // Variant Minimal - Solo contatore totale
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg text-gray-300 text-sm ${className}`}>
        <Eye className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-mono text-gray-100">
          {stats.totalVisitors.toLocaleString()}
        </span>
        <span className="text-gray-500 text-xs">views</span>
      </div>
    );
  }

  // Variant Detailed - Più informazioni
  if (variant === 'detailed') {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-200">Statistiche Live</h3>
          <TrendingUp className="w-4 h-4 text-green-400" />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-white font-mono">
              {stats.totalVisitors.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Totali</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-400 font-mono">
              {stats.currentOnline}
            </div>
            <div className="text-xs text-gray-400">Online</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400 font-mono">
              {stats.todayVisitors}
            </div>
            <div className="text-xs text-gray-400">Oggi</div>
          </div>
        </div>
      </div>
    );
  }

  // Variant Floating - Posizionato fisso
  if (variant === 'floating') {
    const positionClasses = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4'
    };

    return (
      <div className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div 
          className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl cursor-pointer hover:bg-gray-900/95 transition-colors"
          onClick={() => setIsVisible(!isVisible)}
        >
          <div className="px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <Users className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-mono text-gray-100">
              {stats.currentOnline}
            </span>
            <span className="text-xs text-gray-400">online</span>
          </div>
          
          {/* Tooltip espanso al hover */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs whitespace-nowrap shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-mono text-white">{stats.totalVisitors.toLocaleString()}</div>
                  <div className="text-gray-400">Totali</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-yellow-400">{stats.todayVisitors}</div>
                  <div className="text-gray-400">Oggi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
