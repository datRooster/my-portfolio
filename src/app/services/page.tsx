'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/ui/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Search, 
  Shield,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  Users,
  Sparkles,
  Target,
  Trophy,
  Euro
} from 'lucide-react';

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  packages: {
    id: string;
    name: string;
    price: number;
    features: string[];
    deliveryTime: string;
  }[];
  category: string;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  completedProjects: number;
  estimatedDelivery: string;
}

const categoryIcons = {
  'web-development': Globe,
  'mobile-development': Smartphone,
  'backend-development': Database,
  'seo-optimization': Search,
  'security-audit': Shield,
  'performance': Zap,
  'other': Code
};

const categoryColors = {
  'web-development': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'mobile-development': 'bg-green-500/20 text-green-400 border-green-500/30',
  'backend-development': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'seo-optimization': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'security-audit': 'bg-red-500/20 text-red-400 border-red-500/30',
  'performance': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'other': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Errore nel caricamento servizi');
      
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Caricamento servizi...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto p-8">
            <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Ops! Qualcosa è andato storto</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={fetchServices}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Target className="w-5 h-5" />
                Riprova
              </button>
              <Link 
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-8 animate-pulse">
              <Code className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Servizi
              </span>
              <br />
              <span className="text-white">Professionali</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Servizi di sviluppo di alta qualità personalizzati per le tue esigenze. 
              Dalle applicazioni web alle soluzioni mobile, aiuto a dare vita alle tue idee.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Progetti Completati</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-sm text-gray-400">Rating Medio</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">7 giorni</div>
                <div className="text-sm text-gray-400">Consegna Media</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Services Grid */}
            {services.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800/50 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Code className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">Nessun Servizio Disponibile</h2>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  I servizi sono attualmente in preparazione. Ricontrollare più tardi o contattami direttamente.
                </p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Contattami
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => {
                  const IconComponent = categoryIcons[service.category as keyof typeof categoryIcons] || Code;
                  const categoryColorClass = categoryColors[service.category as keyof typeof categoryColors] || categoryColors.other;
                  
                  const basePackage = service.packages.sort((a, b) => a.price - b.price)[0];
                  
                  return (
                    <Card key={service.id} className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
                      <div className="p-6">
                        {/* Service Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
                              <IconComponent className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                {service.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={categoryColorClass}>
                                  {service.category.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {service.shortDescription}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-white">
                              {service.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400">
                              ({service.reviewCount})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-400">
                              {service.completedProjects} completati
                            </span>
                          </div>
                        </div>

                        <Separator className="my-4 bg-gray-800" />

                        {/* Pricing */}
                        {basePackage && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-gray-400">A partire da</span>
                                <div className="font-bold text-xl text-white">
                                  ${basePackage.price}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <Clock className="w-4 h-4" />
                                {basePackage.deliveryTime}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action */}
                        <Link 
                          href={`/services/${service.slug}`}
                          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 group-hover:shadow-lg"
                        >
                          Vedi Dettagli
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 text-center bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Pronto per Iniziare il Tuo Progetto?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Discutiamo i tuoi requisiti e creiamo qualcosa di straordinario insieme. 
                Contattami per una consulenza personalizzata.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors"
                >
                  Iniziamo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white border border-gray-700 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Vedi Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}