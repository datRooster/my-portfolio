import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/database/prisma';
import Navigation from '@/components/ui/Navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Star, 
  MessageSquare, 
  Calendar, 
  Award,
  Sparkles,
  Target,
  Trophy,
  Users,
  Code
} from 'lucide-react';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getService(slug: string) {
  try {
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ],
        status: 'ACTIVE'
      },
      include: {
        testimonials: {
          where: {
            approved: true
          },
          orderBy: {
            rating: 'desc'
          },
          take: 6,
          include: {
            project: {
              select: {
                title: true,
                slug: true
              }
            }
          }
        }
      }
    });

    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

async function getRelatedServices(currentServiceId: string, category?: string) {
  try {
    const services = await prisma.service.findMany({
      where: {
        NOT: {
          id: currentServiceId
        },
        status: 'ACTIVE',
        available: true,
        ...(category && { category: category as any })
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 3
    });

    return services;
  } catch (error) {
    console.error('Error fetching related services:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.slug);

  if (!service) {
    return {
      title: 'Servizio non trovato',
    };
  }

  return {
    title: `${service.title || service.name} | Servizi | Il mio Portfolio`,
    description: service.description,
    keywords: service.tags?.join(', '),
  };
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <Card className="h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {testimonial.avatar && (
            <img 
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

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedServices(service.id, service.category);

  const formatPrice = (price: any) => {
    if (!price) return null;
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numPrice.toLocaleString('it-IT')}`;
  };

  return (
    <>
      <Navigation showBackButton={true} backUrl="/services" backLabel="Servizi" />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-yellow-400 transition-colors">Servizi</Link>
              <span>/</span>
              <span className="text-white">{service.title || service.name}</span>
            </div>

            {/* Service Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  {service.title || service.name}
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                {service.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {service.category?.replace('_', ' ')}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {service.type}
                </Badge>
                {service.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900">
                    <Award className="w-4 h-4 mr-1" />
                    In evidenza
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={`/contact?service=${service.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Richiedi Preventivo
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white border border-gray-700 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Consulenza Gratuita
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
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
                          {service.longDescription}
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