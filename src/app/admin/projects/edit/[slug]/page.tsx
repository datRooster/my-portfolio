'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft, Upload, ExternalLink, Github, ImageIcon, FileText, Tag, Calendar, Settings, User, Building, Zap, CheckCircle, Clock, Archive, FileX, Code, Wrench, Hash } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import GalleryUpload from '@/components/ui/GalleryUpload';

// Utility function per validare URL
const isValidUrl = (string: string): boolean => {
  if (!string || string.trim() === '') return true; // Empty is valid
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  priority: number;
  featured: boolean;
  demoUrl?: string;
  repositoryUrl?: string;
  featuredImage?: string;
  gallery: string[];
  caseStudyUrl?: string;
  role?: string;
  client?: string;
  technologies: string[];
  skills: string[];
  tags: string[];
  startDate: string;  
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditProject() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Configurazione status con icone e colori
  const statusConfig = {
    draft: {
      label: 'Bozza',
      icon: FileX,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20'
    },
    active: {
      label: 'Attivo',
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    completed: {
      label: 'Completato',
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    archived: {
      label: 'Archiviato',
      icon: Archive,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownOpen && !(event.target as Element).closest('.status-dropdown')) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [statusDropdownOpen]);

  const fetchProject = async () => {
    try {
      console.log('🔍 Fetching project with slug:', slug);
      const response = await fetch(`/api/projects/${slug}`);
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('📦 Raw response from API:', responseData);
        
        // L'API restituisce { project: {...} }, quindi estraiamo il progetto
        const projectData = responseData.project;
        console.log('📦 Extracted project data:', projectData);
        
        // Assicuriamoci che gli array siano sempre inizializzati
        const normalizedProject = {
          ...projectData,
          technologies: projectData.technologies || [],
          skills: projectData.skills || [],
          tags: projectData.tags || [],
          gallery: projectData.gallery || []
        };
        console.log('✅ Normalized project data:', normalizedProject);
        setProject(normalizedProject);
      } else {
        console.error('❌ API Response not ok:', response.status);
        setError('Progetto non trovato');
      }
    } catch (error) {
      console.error('💥 Error fetching project:', error);
      setError('Errore nel caricamento del progetto');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        setError('Errore nel salvataggio del progetto');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Errore di rete nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  // Debug: Log project state
  console.log('🎯 Current project state:', project);
  console.log('🔄 Loading state:', loading);
  console.log('❗ Error state:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Progetto non trovato'}</div>
          <button 
            onClick={() => router.push('/admin/projects')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Torna ai progetti
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/projects')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Torna ai progetti
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            <h1 className="text-4xl font-bold">Modifica Progetto</h1>
          </div>
          <p className="text-gray-400 mt-2">Modifica le informazioni del progetto "{project.title}"</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* Info Base */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Informazioni Base</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Titolo *
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({...project, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag size={16} className="inline mr-2" />
                  Categoria
                </label>
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => setProject({...project, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="relative status-dropdown">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Settings size={16} className="inline mr-2" />
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className={`
                      w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:border-yellow-500 focus:outline-none
                      flex items-center justify-between transition-all duration-200 hover:bg-gray-800
                      ${statusConfig[project.status].border}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${statusConfig[project.status].bg}`}>
                        {React.createElement(statusConfig[project.status].icon, {
                          size: 16,
                          className: statusConfig[project.status].color
                        })}
                      </div>
                      <span className="font-medium">
                        {statusConfig[project.status].label}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        statusDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Options */}
                  {statusDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setProject({...project, status: key as Project['status']});
                            setStatusDropdownOpen(false);
                          }}
                          className={`
                            w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150
                            flex items-center gap-3 ${config.border} border-l-4
                            ${project.status === key ? 'bg-gray-700/50' : ''}
                          `}
                        >
                          <div className={`p-1.5 rounded-full ${config.bg}`}>
                            {React.createElement(config.icon, {
                              size: 16,
                              className: config.color
                            })}
                          </div>
                          <div>
                            <div className="font-medium text-white">{config.label}</div>
                            <div className="text-xs text-gray-400">
                              {key === 'draft' && 'Progetto in fase di sviluppo'}
                              {key === 'active' && 'Progetto attivo e visibile'}
                              {key === 'completed' && 'Progetto terminato con successo'}
                              {key === 'archived' && 'Progetto archiviato'}
                            </div>
                          </div>
                          {project.status === key && (
                            <CheckCircle size={16} className="text-yellow-500 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Zap size={16} className="inline mr-2" />
                  Priorità (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={project.priority}
                  onChange={(e) => setProject({...project, priority: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText size={16} className="inline mr-2" />
                Descrizione Breve *
              </label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({...project, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText size={16} className="inline mr-2" />
                Descrizione Dettagliata
              </label>
              <textarea
                value={project.longDescription || ''}
                onChange={(e) => setProject({...project, longDescription: e.target.value})}
                rows={6}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none resize-none"
              />
            </div>

            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={project.featured}
                onChange={(e) => setProject({...project, featured: e.target.checked})}
                className="mr-3 rounded border-gray-600 bg-gray-900 text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                Progetto in evidenza
              </label>
            </div>
          </div>

          {/* Links */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Links e Risorse</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ExternalLink size={16} className="inline mr-2" />
                  URL Demo
                </label>
                <input
                  type="text"
                  placeholder="https://demo.example.com"
                  value={project.demoUrl || ''}
                  onChange={(e) => setProject({...project, demoUrl: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none ${
                    isValidUrl(project.demoUrl || '') 
                      ? 'border-gray-600 focus:border-yellow-500' 
                      : 'border-red-500 focus:border-red-400'
                  }`}
                />
                {project.demoUrl && !isValidUrl(project.demoUrl) && (
                  <p className="text-red-400 text-xs mt-1">URL non valido</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Github size={16} className="inline mr-2" />
                  Repository URL
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/username/repo"
                  value={project.repositoryUrl || ''}
                  onChange={(e) => setProject({...project, repositoryUrl: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none ${
                    isValidUrl(project.repositoryUrl || '') 
                      ? 'border-gray-600 focus:border-yellow-500' 
                      : 'border-red-500 focus:border-red-400'
                  }`}
                />
                {project.repositoryUrl && !isValidUrl(project.repositoryUrl) && (
                  <p className="text-red-400 text-xs mt-1">URL non valido</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Case Study URL
                </label>
                <input
                  type="text"
                  placeholder="https://casestudy.example.com"
                  value={project.caseStudyUrl || ''}
                  onChange={(e) => setProject({...project, caseStudyUrl: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none ${
                    isValidUrl(project.caseStudyUrl || '') 
                      ? 'border-gray-600 focus:border-yellow-500' 
                      : 'border-red-500 focus:border-red-400'
                  }`}
                />
                {project.caseStudyUrl && !isValidUrl(project.caseStudyUrl) && (
                  <p className="text-red-400 text-xs mt-1">URL non valido</p>
                )}
              </div>
            </div>

            {/* Immagine Featured Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Upload size={16} className="inline mr-2" />
                Immagine Featured
              </label>
              <FileUpload
                value={project.featuredImage || ''}
                onChange={(url) => setProject({...project, featuredImage: url})}
                placeholder="Carica l'immagine di copertina del progetto"
                maxSize={5}
              />
            </div>

            {/* Gallery Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <ImageIcon size={16} className="inline mr-2" />
                Gallery Progetto
              </label>
              <GalleryUpload
                value={project.gallery}
                onChange={(urls) => setProject({...project, gallery: urls})}
                placeholder="Carica le immagini per la gallery del progetto"
                maxImages={10}
                maxSize={5}
              />
            </div>
          </div>

          {/* Tecnologie */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Tecnologie e Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Code size={16} className="inline mr-2" />
                  Tecnologie (separate da virgola)
                </label>
                <textarea
                  value={project.technologies.join(', ')}
                  onChange={(e) => setProject({...project, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Wrench size={16} className="inline mr-2" />
                  Skills (separate da virgola)
                </label>
                <textarea
                  value={project.skills.join(', ')}
                  onChange={(e) => setProject({...project, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Hash size={16} className="inline mr-2" />
                  Tags (separate da virgola)
                </label>
                <textarea
                  value={project.tags.join(', ')}
                  onChange={(e) => setProject({...project, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Progetto Info */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Informazioni Progetto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User size={16} className="inline mr-2" />
                  Ruolo
                </label>
                <input
                  type="text"
                  value={project.role || ''}
                  onChange={(e) => setProject({...project, role: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Building size={16} className="inline mr-2" />
                  Cliente
                </label>
                <input
                  type="text"
                  value={project.client || ''}
                  onChange={(e) => setProject({...project, client: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preview Immagine - Solo se URL è valido */}
          {project.featuredImage && isValidUrl(project.featuredImage) && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Preview Immagine</h2>
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src={project.featuredImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Bottoni */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg font-medium transition hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}