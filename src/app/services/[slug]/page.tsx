import CinematicHero from '@/components/home/CinematicHero';
import Image from '@/components/runtime/Image';
import Link from '@/components/runtime/Link';
import { useApi } from '@/lib/http';
import { useParams } from '@/lib/navigation';
import type { ServiceDetail } from '@/types/service';

import Navigation from '@/components/ui/Navigation';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle, Clock, Star } from 'lucide-react';

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <Card className="h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {testimonial.avatar && (
            <Image
              src={testimonial.avatar} 
              alt={testimonial.clientName}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
            />
          )}
          <div className="flex-1">
            <h4 className="font-medium text-white">{testimonial.clientName}</h4>
            {testimonial.clientRole && (
              <p className="text-sm text-gray-400">
                {testimonial.clientRole}
                {testimonial.company && ` @ ${testimonial.company}`}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < testimonial.rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                }`} 
              />
            ))}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed italic mb-3">
          "{testimonial.content}"
        </p>
        
        {testimonial.project && (
          <Link 
            href={`/projects/${testimonial.project.slug}`}
            className="text-yellow-400 hover:text-yellow-300 text-sm underline"
          >
            → Vedi il progetto: {testimonial.project.title}
          </Link>
        )}
      </div>
    </Card>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const { data: service, loading, error } = useApi<ServiceDetail>(`/api/services/${encodeURIComponent(slug || '')}`);
  const { data: related } = useApi<{services: ServiceDetail[]}>('/api/services');
  if (loading) return <p className="p-12 text-white">Caricamento servizio...</p>;
  if (!service) return <div className="p-12 text-white"><p>{error || 'Servizio non trovato'}</p><Link href="/services">Torna ai servizi</Link></div>;
  const relatedServices = (related?.services || []).filter(item => item.id !== service.id && item.category === service.category).slice(0, 3);
  const formatPrice = (price: any) => {
    if (!price) return null;
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numPrice.toLocaleString('it-IT')}`;
  };

  return (
    <>
      <Navigation overlay />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <CinematicHero sceneKey="services" compact title={service.title || service.name} description={service.description} targetId="service-content" secondary={{ href: '/contact?service=' + service.id, label: 'Richiedi preventivo' }} />

        {/* Content Section */}
        <section id="service-content" tabIndex={-1} className="noir-content-section relative py-16 px-4">
          <div className="max-w-7xl mx-auto"><div className="noir-detail-meta"><Link href="/services">← Tutti i servizi</Link><span>{service.category?.replace(/[-_]/g, " ")}</span></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Service Details */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                  <div className="p-8">
                    {/* Long Description */}
                    {service.longDescription && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-white mb-4">Descrizione Completa</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          <span className="whitespace-pre-line">{service.longDescription}</span>
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-white mb-6">Cosa Include</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deliverables */}
                    {service.deliverables && service.deliverables.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-white mb-6">Deliverable</h3>
                        <div className="space-y-3">
                          {service.deliverables.map((deliverable: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-300">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {service.requirements && service.requirements.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-6">Requisiti</h3>
                        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg">
                          <div className="space-y-3">
                            {service.requirements.map((requirement: string, index: number) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-blue-300">{requirement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Testimonials */}
                {service.testimonials && service.testimonials.length > 0 && (
                  <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold text-white mb-2">Testimonianze Clienti</h3>
                      <p className="text-gray-400 mb-8">
                        Cosa dicono le persone che hanno utilizzato questo servizio
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.testimonials.map((testimonial: any) => (
                          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <Card className="sticky top-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                  <div className="p-6">
                    {/* Pricing */}
                    <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg mb-6">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {formatPrice(service.price || service.basePrice) || (
                          <span className="text-lg">Su Preventivo</span>
                        )}
                      </div>
                      {service.maxPrice && service.basePrice && (
                        <div className="text-sm text-gray-400">
                          Range: {formatPrice(service.basePrice)} - {formatPrice(service.maxPrice)}
                        </div>
                      )}
                      {service.pricing === 'HOURLY' && (
                        <div className="text-sm text-gray-400">al giorno</div>
                      )}
                      {service.pricing === 'MONTHLY' && (
                        <div className="text-sm text-gray-400">al mese</div>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="space-y-4 mb-6">
                      {service.duration && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="font-medium">Durata:</span>
                          <span>{service.duration}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <span className="font-medium">Disponibilità:</span>
                        <span className={service.available ? 'text-green-400' : 'text-red-400'}>
                          {service.available ? 'Disponibile' : 'Non disponibile'}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6 bg-gray-800" />

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Link 
                        href={`/contact?service=${service.id}`}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors"
                      >
                        Richiedi Preventivo
                      </Link>
                      
                      <Link 
                        href="/contact"
                        className="block w-full text-center px-4 py-3 bg-gray-800 text-white border border-gray-700 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Consulenza Gratuita
                      </Link>
                    </div>
                  </div>
                </Card>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                  <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                    <div className="p-6">
                      <h4 className="text-xl font-semibold text-white mb-2">Altri Servizi</h4>
                      <p className="text-gray-400 mb-6">Potrebbero interessarti anche</p>
                      
                      <div className="space-y-4">
                        {relatedServices.map((relatedService) => (
                          <Link 
                            key={relatedService.id}
                            href={`/services/${relatedService.slug || relatedService.id}`}
                            className="block p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                          >
                            <h5 className="font-medium text-white mb-1">
                              {relatedService.title || relatedService.name}
                            </h5>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                              {relatedService.description}
                            </p>
                            {relatedService.price && (
                              <div className="text-sm font-medium text-green-400">
                                €{parseFloat(relatedService.price.toString()).toLocaleString('it-IT')}
                              </div>
                            )}
                          </Link>
                        ))}
                        
                        <Link 
                          href="/services"
                          className="block w-full text-center px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Vedi Tutti i Servizi
                        </Link>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
