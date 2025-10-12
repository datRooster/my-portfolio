'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectFilters } from '@/types/project';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import ProjectFiltersComponent from '@/components/portfolio/ProjectFilters';
import Navigation from '@/components/ui/Navigation';
import { 
  Code2, 
  Sparkles, 
  Layers, 
  Zap, 
  Target,
  Trophy,
  Star,
  ArrowRight
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({});

  // Fetch progetti dal backend
  useEffect(() => {
    fetchProjects();
  }, []);

  // Applica filtri quando cambiano
  useEffect(() => {
    let filtered = [...projects];

    // Filtra per categoria
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filtra per status
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Filtra per ricerca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Errore nel caricamento progetti');
      
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };



  const handleFilterChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

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
                onClick={fetchProjects}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Target className="w-5 h-5" />
                Riprova
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Torna alla Home
              </button>
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
          
          <div className="relative max-w-6xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-16 animate-fadeInUp">
              {/* Icon Hero */}
              <div className="flex justify-center mb-8">
                <div className="relative animate-float">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/25">
                    <Code2 className="w-10 h-10 text-gray-900" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                I Miei
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Progetti
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-8 leading-relaxed">
                Ogni progetto è una storia di innovazione, creatività e problem-solving. 
                <span className="text-gray-300"> Dalla sicurezza informatica alle app moderne</span>, 
                scopri le soluzioni che ho creato.
              </p>
              
              {/* Stats Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full backdrop-blur-sm">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Progetti Completati</span>
                  <span className="text-sm font-semibold text-white">{projects.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">In Sviluppo</span>
                  <span className="text-sm font-semibold text-white">{projects.filter(p => p.status === 'in-progress').length}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">In Evidenza</span>
                  <span className="text-sm font-semibold text-white">{projects.filter(p => p.featured).length}</span>
                </div>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-300 animate-fadeInScale">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Architettura Moderna</h3>
                <p className="text-gray-400 text-sm">Soluzioni scalabili e performanti con le tecnologie più avanzate</p>
              </div>
              
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-300 animate-fadeInScale" style={{animationDelay: '0.1s'}}>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sicurezza First</h3>
                <p className="text-gray-400 text-sm">Ogni progetto è sviluppato con i più alti standard di sicurezza</p>
              </div>
              
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-300 animate-fadeInScale" style={{animationDelay: '0.2s'}}>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">UX Perfetta</h3>
                <p className="text-gray-400 text-sm">Design intuitivi e user experience che fanno la differenza</p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider Section */}
        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-24"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-full">
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300 font-medium">Esplora i Progetti</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-24"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters e contenuto */}
        <section className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Filtri con stile migliorato */}
            <div className="mb-12">
              <ProjectFiltersComponent 
                onFiltersChange={handleFilterChange}
                totalProjects={projects.length}
                filteredCount={filteredProjects.length}
              />
            </div>

          {/* Grid progetti */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <Code2 className="w-8 h-8 text-gray-900" />
              </div>
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-lg">Caricamento progetti...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <ProjectGrid projects={filteredProjects} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gray-800/50 border border-gray-700 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Nessun progetto trovato</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                I filtri applicati non hanno prodotto risultati. Prova con criteri diversi o esplora tutti i progetti.
              </p>
              <button 
                onClick={() => setFilters({})}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Mostra Tutti i Progetti
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}