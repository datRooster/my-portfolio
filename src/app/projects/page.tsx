import CinematicHero from '@/components/home/CinematicHero';
import { assetUrl,apiFetch as fetch } from '@/lib/http';

import ProjectFiltersComponent from '@/components/portfolio/ProjectFilters';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import Navigation from '@/components/ui/Navigation';
import { Project,ProjectFilters } from '@/types/project';
import { Code2, Sparkles, Target, Zap } from 'lucide-react';
import { useEffect,useState } from 'react';

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
    if (filters.featured) filtered = filtered.filter(p => p.featured);
    if (filters.technologies?.length) filtered = filtered.filter(p => filters.technologies!.every(tech => p.technologies.includes(tech)));

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
      const response = await fetch('/api/projects?sortBy=priority');
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
        <Navigation overlay />
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
                onClick={() => window.location.href = assetUrl('/')}
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
      <Navigation overlay />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <CinematicHero sceneKey="projects" />

        {/* Filters e contenuto */}
        <section id="projects-content" tabIndex={-1} className="noir-content-section px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Filtri con stile migliorato */}
            <div className="mb-12">
              <ProjectFiltersComponent 
                onFiltersChange={handleFilterChange}
                totalProjects={projects.length}
                filteredCount={filteredProjects.length}
                categories={[...new Set(projects.map(p => p.category))].sort()}
                technologies={[...new Set(projects.flatMap(p => p.technologies))].sort()}
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
