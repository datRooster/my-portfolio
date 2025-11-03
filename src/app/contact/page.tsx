'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/ui/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Sparkles,
  Target,
  MessageCircle,
  Zap
} from 'lucide-react';
import WebchatEmbed from '@/components/ui/WebchatEmbed';

// Types
interface Service {
  id: string;
  name: string;
  title?: string;
  description: string;
  price?: string;
  category: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
  projectType: string;
  serviceId: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('service');

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [contactMethod, setContactMethod] = useState<'form' | 'chat'>('form');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    projectType: '',
    serviceId: preselectedServiceId || ''
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Set preselected service
  useEffect(() => {
    if (preselectedServiceId && services.length > 0) {
      const service = services.find(s => s.id === preselectedServiceId);
      if (service) {
        setSelectedService(service);
        setFormData(prev => ({ ...prev, serviceId: preselectedServiceId }));
      }
    }
  }, [preselectedServiceId, services]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => ({ ...prev, serviceId }));
    
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormState(prev => ({
        ...prev,
        error: 'Nome, email e messaggio sono obbligatori'
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceName: selectedService?.title || selectedService?.name || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore durante l\'invio');
      }

      setFormState(prev => ({ ...prev, isSuccess: true }));
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      }));
    }
  };

  if (formState.isSuccess) {
    return (
      <>
        <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
          <Card className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Messaggio Inviato!
              </h2>
              
              <p className="text-gray-400 mb-8">
                Grazie per avermi contattato. Ti risponderò entro 24 ore.
              </p>
              
              <p className="text-gray-300 mb-8">
                Ho ricevuto la tua richiesta e la esaminerò attentamente. 
                Nel frattempo, puoi dare un'occhiata ai miei progetti.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/projects"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors text-center"
                >
                  Vedi Progetti
                </Link>
                <button 
                  onClick={() => setFormState(prev => ({ ...prev, isSuccess: false }))}
                  className="flex-1 px-6 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Nuovo Messaggio
                </button>
              </div>
            </div>
          </Card>
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-8 animate-pulse">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Parliamo del
              </span>
              <br />
              <span className="text-white">Tuo Progetto</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Hai un'idea da realizzare? Contattami per una consulenza gratuita e 
              scopriamo insieme come trasformare la tua visione in realtà.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-sm text-gray-400">Tempo di Risposta</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Gratuita</div>
                <div className="text-sm text-gray-400">Prima Consulenza</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Personalizzato</div>
              </div>
            </div>

            {/* Contact Method Selector */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-2 flex gap-2">
                <button
                  onClick={() => setContactMethod('form')}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    contactMethod === 'form'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>Form Tradizionale</span>
                  </div>
                  {contactMethod === 'form' && (
                    <p className="text-xs mt-1 opacity-80">Ricevi risposta via email</p>
                  )}
                </button>
                <button
                  onClick={() => setContactMethod('chat')}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 relative ${
                    contactMethod === 'chat'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span>Chat in Tempo Reale</span>
                  </div>
                  {contactMethod === 'chat' && (
                    <p className="text-xs mt-1 opacity-80">Risposte immediate</p>
                  )}
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-yellow-500 text-xs text-gray-900 font-bold rounded-full">
                    NUOVO
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {contactMethod === 'chat' ? (
              /* Webchat Integration */
              <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Chat Community in Tempo Reale</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Unisciti alla Community Chat
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Accedi alla nostra chat IRC per parlare direttamente con me e altri membri della community. 
                    Devi registrarti per partecipare alla conversazione.
                  </p>
                </div>

                <div className="h-[700px]">
                  <WebchatEmbed 
                    fullPage={true}
                    title="IRC Community Chat"
                    description="Chat in tempo reale - Registrazione richiesta"
                  />
                </div>

                <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    Come funziona la chat?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-white mb-1">Registrati</div>
                        <div className="text-gray-400">
                          Crea un account con username e password o usa GitHub OAuth
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-white mb-1">Accedi</div>
                        <div className="text-gray-400">
                          Fai login e accedi ai vari canali della community
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-medium text-white mb-1">Chatta</div>
                        <div className="text-gray-400">
                          Inizia a conversare in tempo reale con me e la community
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Traditional Contact Form */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold text-white mb-2">Richiedi Informazioni</h3>
                    <p className="text-gray-400 mb-8">
                      Compila il form e ti risponderò entro 24 ore con tutte le informazioni di cui hai bisogno.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Error Message */}
                      {formState.error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <span>{formState.error}</span>
                        </div>
                      )}

                      {/* Service Selection */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">Servizio di interesse (opzionale)</Label>
                        <Select 
                          value={formData.serviceId} 
                          onValueChange={handleServiceChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        >
                          <option value="">Consulenza generale</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.title || service.name}
                            </option>
                          ))}
                        </Select>
                        
                        {selectedService && (
                          <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-blue-300">
                                  {selectedService.title || selectedService.name}
                                </h4>
                                <p className="text-sm text-blue-200 mt-1">
                                  {selectedService.description}
                                </p>
                                <div className="mt-2">
                                  <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50">
                                    {selectedService.category.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                              {selectedService.price && (
                                <div className="text-blue-300 font-semibold">
                                  €{parseFloat(selectedService.price).toLocaleString('it-IT')}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* Personal Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Nome completo *</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Il tuo nome"
                            required
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-300">Email *</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="la.tua@email.com"
                            required
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Azienda</Label>
                          <Input
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Nome azienda (opzionale)"
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-300">Telefono</Label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+39 123 456 7890"
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      {/* Project Details */}
                      <Separator className="bg-gray-800" />

                      <div className="space-y-2">
                        <Label className="text-gray-300">Oggetto</Label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Di cosa vuoi parlare?"
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Messaggio *</Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Raccontami del tuo progetto, delle tue esigenze e dei tuoi obiettivi..."
                          rows={5}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Budget indicativo</Label>
                          <Select 
                            value={formData.budget} 
                            onValueChange={(value) => handleInputChange('budget', value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          >
                            <option value="under-5k">Meno di €5.000</option>
                            <option value="5k-10k">€5.000 - €10.000</option>
                            <option value="10k-25k">€10.000 - €25.000</option>
                            <option value="25k-50k">€25.000 - €50.000</option>
                            <option value="over-50k">Oltre €50.000</option>
                            <option value="tbd">Da definire</option>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Tempistiche</Label>
                          <Select 
                            value={formData.timeline} 
                            onValueChange={(value) => handleInputChange('timeline', value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          >
                            <option value="asap">Il prima possibile</option>
                            <option value="1-month">Entro 1 mese</option>
                            <option value="1-3-months">1-3 mesi</option>
                            <option value="3-6-months">3-6 mesi</option>
                            <option value="flexible">Flessibile</option>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Tipo di progetto</Label>
                        <Input
                          value={formData.projectType}
                          onChange={(e) => handleInputChange('projectType', e.target.value)}
                          placeholder="Es: E-commerce, Landing page, App mobile, etc."
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          disabled={formState.isSubmitting}
                          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-purple-400 transition-colors disabled:opacity-50"
                        >
                          {formState.isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Invio in corso...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Invia Richiesta
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                {/* Contact Details */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">Informazioni di Contatto</h4>
                    <p className="text-gray-400 mb-6">Altri modi per raggiungermi</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="font-medium text-white">Email</div>
                          <div className="text-sm text-gray-400">hello@tuodominio.com</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="font-medium text-white">Telefono</div>
                          <div className="text-sm text-gray-400">+39 123 456 7890</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <div>
                          <div className="font-medium text-white">Posizione</div>
                          <div className="text-sm text-gray-400">Italia</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <div>
                          <div className="font-medium text-white">Orari di lavoro</div>
                          <div className="text-sm text-gray-400">Lun-Ven 9:00-18:00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Links */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-6">Link Utili</h4>
                    
                    <div className="space-y-3">
                      <Link 
                        href="/services"
                        className="block w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-center"
                      >
                        Vedi Tutti i Servizi
                      </Link>
                      
                      <Link 
                        href="/projects"
                        className="block w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-center"
                      >
                        Portfolio Progetti
                      </Link>
                      
                      <Link 
                        href="/bug-bounty"
                        className="block w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-center"
                      >
                        Bug Bounty Portfolio
                      </Link>
                    </div>
                  </div>
                </Card>

                {/* FAQ Quick */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-6">FAQ Rapide</h4>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="font-medium text-white mb-1">
                          Quanto tempo per una risposta?
                        </div>
                        <div className="text-gray-400">
                          Rispondo entro 24 ore a tutte le richieste.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-white mb-1">
                          La consulenza è gratuita?
                        </div>
                        <div className="text-gray-400">
                          Sì, la prima consulenza è sempre gratuita.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-white mb-1">
                          Lavori su progetti internazionali?
                        </div>
                        <div className="text-gray-400">
                          Assolutamente sì, lavoro con clienti in tutto il mondo.
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Caricamento...</p>
          </div>
        </div>
      }
    >
      <ContactPageContent />
    </Suspense>
  );
}