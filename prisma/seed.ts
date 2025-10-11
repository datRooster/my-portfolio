import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniziando il seeding del database...');

  // Cleanup esistente (solo in development)
  if (process.env.NODE_ENV === 'development') {
    await prisma.projectTechnology.deleteMany();
    await prisma.projectSkill.deleteMany();
    await prisma.project.deleteMany();
    await prisma.category.deleteMany();
    await prisma.technology.deleteMany();
    await prisma.skill.deleteMany();
    console.log('🧹 Database pulito');
  }

  // ================================
  // CATEGORIES
  // ================================
  console.log('📁 Creando categorie...');
  
  const webDevCategory = await prisma.category.create({
    data: {
      name: 'Web Development',
      description: 'Progetti di sviluppo web e applicazioni',
      icon: '🌐',
      color: '#3B82F6',
      order: 1
    }
  });

  const securityCategory = await prisma.category.create({
    data: {
      name: 'Security Research',
      description: 'Ricerca e audit sulla sicurezza informatica',
      icon: '🔒',
      color: '#EF4444',
      order: 2
    }
  });

  const mobileCategory = await prisma.category.create({
    data: {
      name: 'Mobile App',
      description: 'Applicazioni mobile iOS e Android',
      icon: '📱',
      color: '#10B981',
      order: 3
    }
  });

  // ================================
  // TECHNOLOGIES
  // ================================
  console.log('⚡ Creando tecnologie...');
  
  const technologies = await Promise.all([
    prisma.technology.create({
      data: {
        name: 'Next.js',
        description: 'Framework React per applicazioni full-stack',
        category: 'Frontend',
        website: 'https://nextjs.org'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'TypeScript',
        description: 'JavaScript con tipizzazione statica',
        category: 'Language',
        website: 'https://typescriptlang.org'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'Tailwind CSS',
        description: 'Framework CSS utility-first',
        category: 'CSS',
        website: 'https://tailwindcss.com'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'React',
        description: 'Libreria JavaScript per UI',
        category: 'Frontend',
        website: 'https://react.dev'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'Node.js',
        description: 'Runtime JavaScript server-side',
        category: 'Backend',
        website: 'https://nodejs.org'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'PostgreSQL',
        description: 'Database relazionale avanzato',
        category: 'Database',
        website: 'https://postgresql.org'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'Prisma',
        description: 'ORM moderno per Node.js e TypeScript',
        category: 'Database',
        website: 'https://prisma.io'
      }
    }),
    prisma.technology.create({
      data: {
        name: 'Docker',
        description: 'Containerizzazione e deployment',
        category: 'DevOps',
        website: 'https://docker.com'
      }
    })
  ]);

  // ================================
  // SKILLS
  // ================================
  console.log('🎯 Creando competenze...');
  
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: 'Frontend Development',
        description: 'Sviluppo interfacce utente moderne e responsive',
        category: 'Technical',
        level: 'EXPERT'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'Backend Development',
        description: 'Sviluppo API e architetture server-side',
        category: 'Technical',
        level: 'ADVANCED'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'Security Auditing',
        description: 'Analisi e testing della sicurezza applicazioni',
        category: 'Technical',
        level: 'ADVANCED'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'UI/UX Design',
        description: 'Design di interfacce e user experience',
        category: 'Design',
        level: 'INTERMEDIATE'
      }
    }),
    prisma.skill.create({
      data: {
        name: 'Database Design',
        description: 'Progettazione e ottimizzazione database',
        category: 'Technical',
        level: 'ADVANCED'
      }
    })
  ]);

  // ================================
  // PROJECTS
  // ================================
  console.log('🚀 Creando progetti...');
  
  // Progetto 1: Portfolio
  const portfolioProject = await prisma.project.create({
    data: {
      title: 'Portfolio Personale Next.js',
      description: 'Sito web personale sviluppato con Next.js, TypeScript e Tailwind CSS con sistema di gestione progetti dinamico.',
      longDescription: 'Un portfolio completo sviluppato con le ultime tecnologie web. Include sistema di autenticazione, gestione dinamica dei contenuti, ottimizzazione SEO e performance elevate. Il progetto implementa best practices per la sicurezza, accessibilità e user experience.',
      status: 'COMPLETED',
      priority: 5,
      featured: true,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-15'),
      featuredImage: '/images/projects/portfolio.jpg',
      gallery: [
        '/images/projects/portfolio-1.jpg',
        '/images/projects/portfolio-2.jpg',
        '/images/projects/portfolio-3.jpg'
      ],
      demoUrl: 'https://thewebrooster.dev',
      repositoryUrl: 'https://github.com/datRooster/portfolio',
      slug: 'portfolio-nextjs',
      tags: ['portfolio', 'nextjs', 'typescript'],
      role: 'Full Stack Developer',
      metrics: {
        performance: '95% Lighthouse score',
        loadTime: '1.2s',
        seoScore: 100
      },
      categoryId: webDevCategory.id
    }
  });

  // Progetto 2: Security Dashboard
  const securityProject = await prisma.project.create({
    data: {
      title: 'Security Audit Dashboard',
      description: 'Dashboard per il monitoraggio e analisi delle vulnerabilità di sicurezza con reporting automatizzato.',
      longDescription: 'Una soluzione completa per il monitoraggio della sicurezza che automatizza la detection delle vulnerabilità e genera report dettagliati. Il sistema integra multiple fonti di dati e utilizza machine learning per la classificazione delle minacce.',
      status: 'IN_PROGRESS',
      priority: 4,
      featured: true,
      startDate: new Date('2024-09-15'),
      slug: 'security-audit-dashboard',
      tags: ['security', 'monitoring', 'react'],
      metrics: {
        users: 150,
        vulnerabilitiesDetected: 1200
      },
      categoryId: securityCategory.id
    }
  });

  // Progetto 3: E-commerce API
  const ecommerceProject = await prisma.project.create({
    data: {
      title: 'E-commerce API REST',
      description: 'API REST completa per piattaforma e-commerce con autenticazione JWT e integrazione pagamenti.',
      longDescription: 'API scalabile e sicura per e-commerce con gestione completa di prodotti, ordini, utenti e pagamenti. Implementa pattern di design moderni e best practices per la sicurezza delle transazioni.',
      status: 'COMPLETED',
      priority: 3,
      featured: false,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-08-30'),
      repositoryUrl: 'https://github.com/datRooster/ecommerce-api',
      slug: 'ecommerce-api-rest',
      tags: ['api', 'ecommerce', 'nodejs'],
      client: 'StartupXYZ',
      role: 'Backend Developer',
      categoryId: webDevCategory.id
    }
  });

  // ================================
  // RELAZIONI PROGETTI-TECNOLOGIE
  // ================================
  console.log('🔗 Creando relazioni progetti-tecnologie...');
  
  // Portfolio - Technologies
  await Promise.all([
    prisma.projectTechnology.create({
      data: {
        projectId: portfolioProject.id,
        technologyId: technologies.find(t => t.name === 'Next.js')!.id,
        importance: 5
      }
    }),
    prisma.projectTechnology.create({
      data: {
        projectId: portfolioProject.id,
        technologyId: technologies.find(t => t.name === 'TypeScript')!.id,
        importance: 4
      }
    }),
    prisma.projectTechnology.create({
      data: {
        projectId: portfolioProject.id,
        technologyId: technologies.find(t => t.name === 'Tailwind CSS')!.id,
        importance: 4
      }
    }),
    prisma.projectTechnology.create({
      data: {
        projectId: portfolioProject.id,
        technologyId: technologies.find(t => t.name === 'Prisma')!.id,
        importance: 3
      }
    })
  ]);

  // Security Dashboard - Technologies
  await Promise.all([
    prisma.projectTechnology.create({
      data: {
        projectId: securityProject.id,
        technologyId: technologies.find(t => t.name === 'React')!.id,
        importance: 5
      }
    }),
    prisma.projectTechnology.create({
      data: {
        projectId: securityProject.id,
        technologyId: technologies.find(t => t.name === 'Node.js')!.id,
        importance: 4
      }
    }),
    prisma.projectTechnology.create({
      data: {
        projectId: securityProject.id,
        technologyId: technologies.find(t => t.name === 'PostgreSQL')!.id,
        importance: 3
      }
    })
  ]);

  // E-commerce API - Technologies
  await Promise.all([
    prisma.projectTechnology.create({
      data: {
        projectId: ecommerceProject.id,
        technologyId: technologies.find(t => t.name === 'Node.js')!.id,
        importance: 5
      }
    }),
    prisma.projectTechnology.create({
      data: {
        projectId: ecommerceProject.id,
        technologyId: technologies.find(t => t.name === 'PostgreSQL')!.id,
        importance: 4
      }
    })
  ]);

  // ================================
  // RELAZIONI PROGETTI-SKILLS
  // ================================
  console.log('🎯 Creando relazioni progetti-competenze...');
  
  // Portfolio - Skills
  await Promise.all([
    prisma.projectSkill.create({
      data: {
        projectId: portfolioProject.id,
        skillId: skills.find(s => s.name === 'Frontend Development')!.id,
        level: 'EXPERT'
      }
    }),
    prisma.projectSkill.create({
      data: {
        projectId: portfolioProject.id,
        skillId: skills.find(s => s.name === 'UI/UX Design')!.id,
        level: 'ADVANCED'
      }
    })
  ]);

  // Security Dashboard - Skills
  await Promise.all([
    prisma.projectSkill.create({
      data: {
        projectId: securityProject.id,
        skillId: skills.find(s => s.name === 'Security Auditing')!.id,
        level: 'EXPERT'
      }
    }),
    prisma.projectSkill.create({
      data: {
        projectId: securityProject.id,
        skillId: skills.find(s => s.name === 'Backend Development')!.id,
        level: 'ADVANCED'
      }
    })
  ]);

  console.log('✅ Seeding completato con successo!');
  console.log(`📊 Creati:`);
  console.log(`   - ${await prisma.category.count()} categorie`);
  console.log(`   - ${await prisma.technology.count()} tecnologie`);
  console.log(`   - ${await prisma.skill.count()} competenze`);
  console.log(`   - ${await prisma.project.count()} progetti`);
  console.log(`   - ${await prisma.projectTechnology.count()} relazioni progetto-tecnologia`);
  console.log(`   - ${await prisma.projectSkill.count()} relazioni progetto-competenza`);
}

main()
  .catch((e) => {
    console.error('❌ Errore durante il seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });