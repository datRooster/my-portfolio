'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Search, Filter, Plus, ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  category: string;
  categories: string[];
  demoUrl?: string;
  repositoryUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  featuredImage?: string;
  imageUrl?: string;
  featured: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  priority: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  technologies: string[];
  skills: string[];
  tags: string[];
  role?: string;
  client?: string;
  team?: string[];
  metrics?: Record<string, any>;
  gallery?: string[];
  screenshots?: string[];
}

interface NewProject {
  title: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  categories: string[];
  demoUrl: string;
  repositoryUrl: string;
  githubUrl: string;
  liveUrl: string;
  caseStudyUrl: string;
  featuredImage: string;
  imageUrl: string;
  featured: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  priority: number;
  technologies: string[];
  skills: string[];
  tags: string[];
  role: string;
  client: string;
}

const statusColors = {
  draft: 'bg-orange-500/80',
  active: 'bg-blue-500/80',
  completed: 'bg-emerald-500/80',
  archived: 'bg-gray-500/80'
};

const statusLabels = {
  draft: 'Bozza',
  active: 'Attivo',
  completed: 'Completato',
  archived: 'Archiviato'
};

const statusIcons = {
  draft: '📝',
  active: '🚀',
  completed: '✅',
  archived: '📦'
};

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    description: '',
    shortDescription: '',
    longDescription: '',
    category: '',
    categories: [],
    demoUrl: '',
    repositoryUrl: '',
    githubUrl: '',
    liveUrl: '',
    caseStudyUrl: '',
    featuredImage: '',
    imageUrl: '',
    featured: false,
    status: 'draft',
    priority: 1,
    technologies: [],
    skills: [],
    tags: [],
    role: '',
    client: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.error('Failed to load projects');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        await loadProjects();
        setShowModal(false);
        resetForm();
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };



  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo progetto?')) return;

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const response = await fetch(`/api/projects/${project.slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadProjects();
      } else {
        const errorData = await response.text();
        console.error('Failed to delete project:', response.status, errorData);
        alert('Errore nella cancellazione del progetto. Verifica i log della console.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Errore di rete nella cancellazione del progetto.');
    }
  };



  const resetForm = () => {
    setNewProject({
      title: '',
      description: '',
      shortDescription: '',
      longDescription: '',
      category: '',
      categories: [],
      demoUrl: '',
      repositoryUrl: '',
      githubUrl: '',
      liveUrl: '',
      caseStudyUrl: '',
      featuredImage: '',
      imageUrl: '',
      featured: false,
      status: 'draft',
      priority: 1,
      technologies: [],
      skills: [],
      tags: [],
      role: '',
      client: ''
    });
  };

  const addTag = (type: 'categories' | 'technologies' | 'skills' | 'tags', tag: string) => {
    if (tag.trim() && !newProject[type].includes(tag.trim())) {
      setNewProject(prev => ({
        ...prev,
        [type]: [...prev[type], tag.trim()]
      }));
    }
  };

  const removeTag = (type: 'categories' | 'technologies' | 'skills' | 'tags', index: number) => {
    setNewProject(prev => ({  
      ...prev,
      [type]: prev[type].filter((_: string, i: number) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Caricamento progetti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Gestione Progetti
            </h1>
            <p className="text-gray-300 text-lg">Gestisci i tuoi progetti del portfolio</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nuovo Progetto
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = projects.filter(p => p.status === status).length;
            return (
              <div key={status} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{statusIcons[status as keyof typeof statusIcons]}</span>
                  <div>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-sm text-gray-400">{label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca progetti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-gray-900/50 border border-gray-600/50 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 cursor-pointer min-w-[200px]"
              >
                <option value="all" className="bg-gray-800 text-white">Tutti gli stati</option>
                <option value="draft" className="bg-gray-800 text-white">📝 Bozza</option>
                <option value="active" className="bg-gray-800 text-white">🚀 Attivo</option>
                <option value="completed" className="bg-gray-800 text-white">✅ Completato</option>
                <option value="archived" className="bg-gray-800 text-white">📦 Archiviato</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/25">
              {/* Project Image */}
              {project.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`${statusColors[project.status]} text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20`}>
                      {statusIcons[project.status]} {statusLabels[project.status]}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        ⭐ In evidenza
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Project Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {project.shortDescription || project.description}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-400 ml-4">
                    <p className="font-medium">Priorità {project.priority}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3 mb-6">
                  {project.categories && project.categories.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Categorie</p>
                      <div className="flex flex-wrap gap-2">
                        {project.categories.map((category: string, index: number) => (
                          <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div>  
                      <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Tecnologie</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech: string, index: number) => (
                          <span key={index} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-500/30">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 mb-6">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-400">
                    Aggiornato: {new Date(project.updatedAt).toLocaleDateString('it-IT')}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/edit/${project.slug}`}
                      className="bg-blue-600/80 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Modifica
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-red-600/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nessun progetto trovato</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Prova a modificare i filtri di ricerca' 
                : 'Inizia creando il tuo primo progetto'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crea il primo progetto
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal placeholder - We'll add the full form next */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                Nuovo Progetto
              </h2>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 space-y-6">
              {/* Basic Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Titolo*</label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Stato</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="draft">Bozza</option>
                    <option value="active">Attivo</option>
                    <option value="completed">Completato</option>
                    <option value="archived">Archiviato</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Descrizione*</label>
                <textarea
                  required
                  rows={4}
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 transition"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg font-medium transition hover:from-yellow-400 hover:to-orange-400"
                >
                  Crea Progetto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}