'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  FolderOpen, 
  User, 
  Mail, 
  Settings, 
  Menu, 
  X,
  ChevronLeft,
  ExternalLink,
  Shield
} from 'lucide-react';

interface NavigationProps {
  showBackButton?: boolean;
  backUrl?: string;
  backLabel?: string;
}

export default function Navigation({ showBackButton = false, backUrl = '/', backLabel = 'Home' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Progetti', href: '/projects', icon: FolderOpen },
    { name: 'Bug Bounty', href: '/bug-bounty', icon: Shield },
    { name: 'Chi Sono', href: '/about', icon: User },
    { name: 'Contatti', href: '/contatti', icon: Mail },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Back button or Logo */}
            <div className="flex items-center gap-4">
              {showBackButton ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{backLabel}</span>
                </button>
              ) : (
                <div className="flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    theWebRooster
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </button>
                );
              })}
              
              {/* Admin Link */}
              <button
                onClick={() => handleNavigation('/admin')}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Pannello Admin"
              >
                <Settings className="w-4 h-4" />
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}
              
              {/* Mobile Admin Link */}
              <button
                onClick={() => handleNavigation('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                Pannello Admin
                <ExternalLink className="w-4 h-4 ml-auto" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden under fixed nav */}
      <div className="h-16"></div>
    </>
  );
}