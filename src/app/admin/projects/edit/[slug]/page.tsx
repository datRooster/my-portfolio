'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft, Upload, ExternalLink, Github } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';

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

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

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
          tags: projectData.tags || []
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
                  Categoria
                </label>
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => setProject({...project, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={project.status}
                  onChange={(e) => setProject({...project, status: e.target.value as Project['status']})}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="draft">Bozza</option>
                  <option value="active">Attivo</option>
                  <option value="completed">Completato</option>
                  <option value="archived">Archiviato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
          </div>

          {/* Tecnologie */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Tecnologie e Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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