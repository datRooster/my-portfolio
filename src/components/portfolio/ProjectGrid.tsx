import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { Sparkles, Layers } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="space-y-8">
      {/* Header della griglia */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Portfolio Progetti
            </h2>
            <p className="text-gray-400 text-sm">
              {projects.length} progett{projects.length === 1 ? 'o' : 'i'} trovati
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">
            {projects.filter(p => p.featured).length} in evidenza
          </span>
        </div>
      </div>
      
      {/* Griglia con animazioni scaglionate */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="animate-fadeInScale"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      
      {/* Footer motivazionale */}
      {projects.length > 0 && (
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">
              Ogni progetto racconta una storia di innovazione
            </span>
          </div>
        </div>
      )}
    </div>
  );
}