'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import { useEffect, useState } from 'react';
import { isUserAdmin } from '@/lib/auth-client';
import { 
  Edit, 
  ExternalLink, 
  Github, 
  Star, 
  Calendar, 
  Tag, 
  Zap, 
  Award,
  Eye,
  ArrowRight,
  Sparkles,
  Shield,
  Code,
  Layers
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
    };
    
    checkAdmin();
  }, []);

  const statusColors = {
    completed: 'bg-green-500/10 text-green-400',
    'in-progress': 'bg-yellow-500/10 text-yellow-400',
    archived: 'bg-gray-500/10 text-gray-400',
    draft: 'bg-blue-500/10 text-blue-400'
  };

  const statusLabels = {
    completed: 'Completato',
    'in-progress': 'In Corso',
    archived: 'Archiviato',
    draft: 'Bozza'
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10 animate-fadeInScale">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Immagine con Overlay Moderno */}
      {project.featuredImage ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay sfumato */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
          
          {/* Badge Featured */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold">
                <Star className="w-3 h-3" fill="currentColor" />
                In Evidenza
              </div>
            </div>
          )}
          
          {/* Badge Status */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${statusColors[project.status]}`}>
              {project.status === 'completed' && <Award className="w-3 h-3" />}
              {project.status === 'in-progress' && <Zap className="w-3 h-3" />}
              {project.status === 'archived' && <Shield className="w-3 h-3" />}
              {project.status === 'draft' && <Edit className="w-3 h-3" />}
              {statusLabels[project.status]}
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder moderno quando non c'è immagine */
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center">
            <Code className="w-8 h-8 text-gray-400" />
          </div>
          
          {/* Badge Featured */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold">
                <Star className="w-3 h-3" fill="currentColor" />
                In Evidenza
              </div>
            </div>
          )}
          
          {/* Badge Status */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${statusColors[project.status]}`}>
              {project.status === 'completed' && <Award className="w-3 h-3" />}
              {project.status === 'in-progress' && <Zap className="w-3 h-3" />}
              {project.status === 'archived' && <Shield className="w-3 h-3" />}
              {project.status === 'draft' && <Edit className="w-3 h-3" />}
              {statusLabels[project.status]}
            </div>
          </div>
        </div>
      )}

      {/* Contenuto Moderno */}
      <div className="relative p-6">
        {/* Header con Priority Stars */}
        <div className="mb-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
              {project.title}
            </h3>
            {project.priority > 3 && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {[...Array(project.priority)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500" fill="currentColor" />
                ))}
              </div>
            )}
          </div>
          
          {/* Categoria con icona */}
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-500 font-medium">
              {project.category}
            </span>
          </div>
          
          {/* Descrizione */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tecnologie Moderne */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">STACK TECNOLOGICO</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <div
                key={tech}
                className="px-3 py-1.5 bg-gray-800/80 border border-gray-700 text-gray-300 rounded-lg text-xs font-medium hover:border-yellow-500/50 hover:text-yellow-400 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {tech}
              </div>
            ))}
            {project.technologies.length > 3 && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg text-xs font-medium">
                +{project.technologies.length - 3} altri
              </div>
            )}
          </div>
        </div>

        {/* Links Azioni con Design Moderno */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 hover:border-green-500/50 transition-all duration-300 group/btn"
                title="Demo Live"
              >
                <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 bg-gray-700/50 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-600/50 hover:border-gray-500 hover:text-white transition-all duration-300 group/btn"
                title="Repository"
              >
                <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </a>
            )}
          </div>
          
          {/* Link dettagli principale */}
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 group/main"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Scopri</span>
            <ArrowRight className="w-3 h-3 group-hover/main:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer con Data e Admin */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">
              {new Date(project.createdAt).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
          
          {isAdmin && (
            <Link
              href={`/admin/projects/edit/${project.slug}`}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors opacity-0 group-hover:opacity-100"
              title="Modifica progetto"
            >
              <Edit className="w-3 h-3" />
              Modifica
            </Link>
          )}
        </div>
        
        {/* Effetto glow bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
}