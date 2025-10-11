// Interfaccia principale per i progetti
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string; // Descrizione dettagliata per la pagina del singolo progetto
  
  // Metadati
  status: 'completed' | 'in-progress' | 'archived' | 'draft';
  category: string; // es: "Web Development", "Security Research", "Mobile App"
  priority: number; // 1-5 per ordinamento
  
  // Date
  startDate: string; // ISO string
  endDate?: string; // ISO string, null se in progress
  createdAt: string;
  updatedAt: string;
  
  // Media
  featuredImage?: string; // Immagine principale
  gallery?: string[]; // Array di immagini aggiuntive
  screenshots?: string[];
  
  // Tecnologie e competenze
  technologies: string[]; // ["React", "Node.js", "MongoDB"]
  skills: string[]; // ["Frontend", "API Design", "Security"]
  
  // Links e demo
  demoUrl?: string; // Link alla demo live
  repositoryUrl?: string; // Link al repository GitHub
  caseStudyUrl?: string; // Link a case study dettagliato
  
  // SEO e presentazione
  slug: string; // URL friendly: "e-commerce-platform"
  tags: string[]; // Per filtering: ["ecommerce", "fullstack", "react"]
  featured: boolean; // Progetto in evidenza
  
  // Metriche (opzionali)
  metrics?: {
    users?: number;
    downloads?: number;
    stars?: number;
    performance?: string; // es: "95% Lighthouse score"
  };
  
  // Collaborazione
  client?: string; // Nome del cliente se lavoro freelance
  team?: string[]; // Membri del team
  role?: string; // Il tuo ruolo nel progetto
}

// Tipi per filtering e ricerca
export interface ProjectFilters {
  category?: string;
  status?: Project['status'];
  technologies?: string[];
  tags?: string[];
  featured?: boolean;
  search?: string;
}

// Risposta API per lista paginata
export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}