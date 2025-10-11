'use client';

import { useState } from 'react';
import { ProjectFilters } from '@/types/project';

interface ProjectFiltersComponentProps {
  onFiltersChange: (filters: ProjectFilters) => void;
  totalProjects: number;
  filteredCount: number;
}

export default function ProjectFiltersComponent({ 
  onFiltersChange, 
  totalProjects, 
  filteredCount 
}: ProjectFiltersComponentProps) {
  const [activeFilters, setActiveFilters] = useState<ProjectFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Web Development',
    'Security Research', 
    'Mobile App',
    'Desktop App',
    'DevOps',
    'Machine Learning',
    'Blockchain'
  ];

  const technologies = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 
    'PHP', 'MySQL', 'MongoDB', 'Docker', 'AWS', 'Vercel'
  ];

  const statuses = [
    { value: 'completed', label: 'Completato' },
    { value: 'in-progress', label: 'In Corso' },
    { value: 'archived', label: 'Archiviato' }
  ] as const;

  const updateFilters = (newFilters: Partial<ProjectFilters>) => {
    const updated = { ...activeFilters, ...newFilters };
    setActiveFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFiltersChange({});
  };

  const toggleTechnology = (tech: string) => {
    const currentTechs = activeFilters.technologies || [];
    const newTechs = currentTechs.includes(tech)
      ? currentTechs.filter(t => t !== tech)
      : [...currentTechs, tech];
    
    updateFilters({ technologies: newTechs.length > 0 ? newTechs : undefined });
  };

  return (
    <div className="mb-8">
      {/* Header filtri */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            {filteredCount} di {totalProjects} progetti
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            {showFilters ? 'Nascondi Filtri' : 'Mostra Filtri'}
          </button>
        </div>
        
        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={clearFilters}
            className="text-yellow-500 hover:text-yellow-400 text-sm underline"
          >
            Rimuovi tutti i filtri
          </button>
        )}
      </div>

      {/* Filtri attivi */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.category && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
              Categoria: {activeFilters.category}
              <button onClick={() => updateFilters({ category: undefined })}>×</button>
            </span>
          )}
          {activeFilters.status && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
              Status: {statuses.find(s => s.value === activeFilters.status)?.label}
              <button onClick={() => updateFilters({ status: undefined })}>×</button>
            </span>
          )}
          {activeFilters.featured && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
              In Evidenza
              <button onClick={() => updateFilters({ featured: undefined })}>×</button>
            </span>
          )}
          {activeFilters.technologies?.map((tech) => (
            <span key={tech} className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
              {tech}
              <button onClick={() => toggleTechnology(tech)}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Panel filtri */}
      {showFilters && (
        <div className="bg-gray-900 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Categoria */}
            <div>
              <h3 className="font-medium mb-3">Categoria</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={activeFilters.category === category}
                      onChange={() => updateFilters({ 
                        category: activeFilters.category === category ? undefined : category 
                      })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="font-medium mb-3">Status</h3>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={activeFilters.status === status.value}
                      onChange={() => updateFilters({ 
                        status: activeFilters.status === status.value ? undefined : status.value 
                      })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-300">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div>
              <h3 className="font-medium mb-3">Evidenza</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.featured || false}
                  onChange={(e) => updateFilters({ featured: e.target.checked || undefined })}
                  className="text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-300">Solo progetti in evidenza</span>
              </label>
            </div>

            {/* Tecnologie */}
            <div>
              <h3 className="font-medium mb-3">Tecnologie</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {technologies.map((tech) => (
                  <label key={tech} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.technologies?.includes(tech) || false}
                      onChange={() => toggleTechnology(tech)}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-300">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}