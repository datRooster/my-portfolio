import CinematicHero from '@/components/home/CinematicHero';
import { apiFetch as fetch } from '@/lib/http';

import Link from '@/components/runtime/Link';
import Navigation from '@/components/ui/Navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams } from '@/lib/navigation';
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, MessageCircle, Phone, Send, Zap } from 'lucide-react';
import { Suspense,useEffect,useState } from 'react';

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
  const [contactMethod, setContactMethod] = useState<'form' | 'profiles'>('form');
  
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
        <Navigation overlay />
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
                Grazie per avermi contattato. La tua richiesta è stata ricevuta.
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
      <Navigation overlay />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <CinematicHero sceneKey="contact" />

        {/* Content Section */}
        <section id="contact-content" tabIndex={-1} className="noir-content-section relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
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
                    <span>Scrivimi</span>
                  </div>
                  {contactMethod === 'form' && (
                    <p className="text-xs mt-1 opacity-80">Ricevi risposta via email</p>
                  )}
                </button>
                <button
                  onClick={() => setContactMethod('profiles')}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 relative ${
                    contactMethod === 'profiles'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span>Profili pubblici</span>
                  </div>
                  {contactMethod === 'profiles' && (
                    <p className="text-xs mt-1 opacity-80">GitHub e WordPress.org</p>
                  )}
                </button>
              </div>
            </div>

            {contactMethod === 'profiles' ? (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Codice, plugin e contribuzioni</h2>
                <p className="text-gray-400 mb-8">I miei profili pubblici raccolgono sorgenti, aggiornamenti e contributi alla community.</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    {name:'GitHub · datRooster',href:'https://github.com/datRooster',text:'Repository pubbliche di temi, plugin e applicazioni.'},
                    {name:'WordPress.org · datroooster',href:'https://profiles.wordpress.org/datroooster/',text:'Profilo ufficiale, attività e badge della community.'},
                    {name:'DatRooster Partial Payments',href:'https://wordpress.org/plugins/datrooster-partial-payments/',text:'Pagina del plugin, documentazione e download ufficiale.'},
                    {name:'LinkedIn · Amedeo Galletta',href:'https://www.linkedin.com/in/amedeo-galletta-812835292/',text:'Il mio profilo professionale.'}
                  ].map(profile=><a key={profile.href} href={profile.href} target="_blank" rel="noopener noreferrer" className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-blue-400"><h3 className="text-lg font-semibold text-white mb-2">{profile.name} ↗</h3><p className="text-gray-400 text-sm">{profile.text}</p></a>)}
                </div>
                <button type="button" onClick={()=>setContactMethod('form')} className="mt-8 text-blue-300 hover:text-white">Vuoi parlarmi di un progetto? Apri il modulo →</button>
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
                      Compila il form con obiettivi e funzionalità. Se parti da uno dei miei lavori, indica il progetto che ti interessa.
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
                          <a href="mailto:contact@webrooster.it" className="text-sm text-blue-300 hover:underline">contact@webrooster.it</a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="font-medium text-white">Telefono</div>
                          <div className="text-sm text-gray-400">Da concordare dopo il primo contatto</div>
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
                          <div className="font-medium text-white">Confronto sul progetto</div>
                          <div className="text-sm text-gray-400">Appuntamento da concordare via email</div>
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
                          Cosa devo includere nella richiesta?
                        </div>
                        <div className="text-gray-400">
                          Obiettivi, funzionalità, contenuti disponibili e scadenze. Puoi aggiungere un link al sito esistente.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-white mb-1">
                          Lavori anche su un sito esistente?
                        </div>
                        <div className="text-gray-400">
                          Possiamo valutare un tema dedicato, un plugin o una nuova integrazione. Indica WordPress, WooCommerce e i plugin già in uso.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-white mb-1">
                          Dove posso vedere il tuo codice?
                        </div>
                        <div className="text-gray-400">
                          <a href="https://github.com/datRooster" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Su GitHub</a> e nella <a href="https://wordpress.org/plugins/datrooster-partial-payments/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">directory plugin WordPress.org</a>.
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
