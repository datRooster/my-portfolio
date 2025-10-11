'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectFilters } from '@/types/project';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import ProjectFiltersComponent from '@/components/portfolio/ProjectFilters';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Caricamento progetti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Errore</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchProjects}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            I Miei Progetti
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Una raccolta dei progetti più significativi che ho sviluppato nel corso della mia carriera.
            Dalla sicurezza informatica alle applicazioni web, ogni progetto rappresenta una sfida superata.
          </p>
        </div>
      </section>

      {/* Filters e contenuto */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Filtri */}
          <ProjectFiltersComponent 
            onFiltersChange={handleFilterChange}
            totalProjects={projects.length}
            filteredCount={filteredProjects.length}
          />

          {/* Grid progetti */}
          {filteredProjects.length > 0 ? (
            <ProjectGrid projects={filteredProjects} />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Nessun progetto trovato</h3>
              <p className="text-gray-400">
                Prova a modificare i filtri o{' '}
                <button 
                  onClick={() => setFilters({})}
                  className="text-yellow-500 hover:text-yellow-400 underline"
                >
                  rimuovi tutti i filtri
                </button>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}