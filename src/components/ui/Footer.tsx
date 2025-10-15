'use client';

import Link from 'next/link';
import VisitorCounter from './VisitorCounter';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  Heart,
  Code,
  Shield,
  Zap,
  ArrowUp,
  ExternalLink,
  Coffee,
  Star,
  Globe
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Progetti', href: '/projects' },
    { name: 'Chi Sono', href: '/about' },
    { name: 'Contatti', href: '/contact' }
  ];

  const services = [
    { name: 'Web Development', icon: Code },
    { name: 'Security Research', icon: Shield },
    { name: 'Consulting', icon: Zap },
    { name: 'Bug Bounty', icon: Star }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/datRooster',
      icon: Github,
      color: 'hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/amedeo-galletta-812835292/',
      icon: Linkedin,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Email',
      href: 'mailto:contact@webrooster.it',
      icon: Mail,
      color: 'hover:text-yellow-400'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-950 border-t border-gray-800">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    theWebRooster
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-lg">
                  Architect, Security Researcher e Web Developer. Creo soluzioni innovative 
                  che uniscono performance, sicurezza e design elegante. 
                  Sempre alla ricerca della prossima sfida tecnologica.
                </p>
                
                {/* Services Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div key={service.name} className="flex items-center gap-2 p-2 bg-gray-900/30 rounded-lg border border-gray-800">
                        <Icon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{service.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-yellow-400" />
                Navigazione
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-yellow-400 transition-colors"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/admin"
                    className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                    Admin Panel
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                Contatti
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Italia</p>
                    <p className="text-gray-500 text-xs">Remote Worldwide</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <a href="mailto:contact@theweb-rooster.com" className="text-gray-300 text-sm hover:text-yellow-400 transition-colors">
                      contact@theweb-rooster.com
                    </a>
                    <p className="text-gray-500 text-xs">Rispondo entro 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Su richiesta</p>
                    <p className="text-gray-500 text-xs">Solo progetti seri</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider con effetto */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent h-px"></div>
          <div className="flex justify-center">
            <div className="bg-gray-950 px-6">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <Coffee className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} theWebRooster</span>
              <div className="flex items-center gap-1 text-red-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span>in Italy</span>
              </div>
            </div>

            {/* Center - Social Links + Visitor Counter */}
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:border-gray-600 hover:scale-110`}
                      title={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
              
              {/* Visitor Counter */}
              <VisitorCounter variant="minimal" />
            </div>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 hover:bg-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-110 group"
              title="Torna su"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tech Stack Footer */}
        <div className="border-t border-gray-800/50 bg-gray-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Powered by Next.js
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secured & Optimized
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Code className="w-3 h-3" />
                Crafted with Care
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}