import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProjects() {
  try {
    console.log('🌱 Seeding database con progetti di esempio...');

    // 1. Crea categorie se non esistono
    const webDev = await prisma.category.upsert({
      where: { name: 'Web Development' },
      update: {},
      create: {
        name: 'Web Development',
        description: 'Progetti di sviluppo web',
        icon: '💻',
        color: '#3B82F6'
      }
    });

    const mobileApp = await prisma.category.upsert({
      where: { name: 'Mobile App' },
      update: {},
      create: {
        name: 'Mobile App',
        description: 'Applicazioni mobile',
        icon: '📱',
        color: '#10B981'
      }
    });

    // 2. Crea tecnologie se non esistono
    const react = await prisma.technology.upsert({
      where: { name: 'React' },
      update: {},
      create: {
        name: 'React',
        description: 'Libreria JavaScript per UI',
        category: 'frontend',
        icon: '⚛️',
        color: '#61DAFB',
        website: 'https://reactjs.org'
      }
    });

    const nextjs = await prisma.technology.upsert({
      where: { name: 'Next.js' },
      update: {},
      create: {
        name: 'Next.js',
        description: 'Framework React per produzione',
        category: 'framework',
        icon: '▲',
        color: '#000000',
        website: 'https://nextjs.org'
      }
    });

    const typescript = await prisma.technology.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: {
        name: 'TypeScript',
        description: 'JavaScript tipizzato',
        category: 'language',
        icon: 'TS',
        color: '#3178C6',
        website: 'https://typescriptlang.org'
      }
    });

    const tailwind = await prisma.technology.upsert({
      where: { name: 'TailwindCSS' },
      update: {},
      create: {
        name: 'TailwindCSS',
        description: 'Framework CSS utility-first',
        category: 'css',
        icon: '🎨',
        color: '#06B6D4',
        website: 'https://tailwindcss.com'
      }
    });

    // 3. Crea progetti
    const project1 = await prisma.project.upsert({
      where: { slug: 'portfolio-nextjs' },
      update: {},
      create: {
        title: 'Portfolio Personal con Next.js',
        slug: 'portfolio-nextjs',
        description: 'Portfolio personale sviluppato con Next.js 15, TypeScript e TailwindCSS. Include sistema di autenticazione 2FA, dashboard admin e integrazione database.',
        longDescription: 'Un portfolio completo e moderno che showcase le mie competenze di sviluppo full-stack. Il progetto implementa le tecnologie più recenti includendo Next.js 15 con App Router, autenticazione sicura con 2FA, interfaccia admin per la gestione dei contenuti e design responsive con TailwindCSS.',
        categoryId: webDev.id,
        status: 'COMPLETED',
        featured: true,
        priority: 100,
        repositoryUrl: 'https://github.com/thatrooster/portfolio-nextjs',
        demoUrl: 'https://thatrooster-portfolio.vercel.app',
        featuredImage: '/images/projects/portfolio-1.jpg',
        gallery: ['/images/projects/portfolio-1.jpg', '/images/projects/portfolio-2.jpg', '/images/projects/portfolio-3.jpg'],
        screenshots: ['/images/projects/portfolio-desktop.jpg', '/images/projects/portfolio-mobile.jpg'],
        tags: ['portfolio', 'fullstack', '2fa', 'responsive'],
        role: 'Full-Stack Developer',
        client: 'Personal Project',
        team: ['Solo Developer'],
        metrics: {
          'performance': '95/100',
          'accessibility': '98/100',
          'seo': '100/100'
        },
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-20')
      }
    });

    const project2 = await prisma.project.upsert({
      where: { slug: 'ecommerce-platform' },
      update: {},
      create: {
        title: 'Piattaforma E-commerce',
        slug: 'ecommerce-platform',
        description: 'Piattaforma e-commerce completa con gestione prodotti, carrello, pagamenti e dashboard admin.',
        longDescription: 'Una soluzione e-commerce completa sviluppata per un cliente reale. Include gestione catalogo prodotti, sistema di carrello avanzato, integrazione con gateway di pagamento, dashboard amministrativa e analytics dettagliati.',
        categoryId: webDev.id,
        status: 'COMPLETED',
        featured: true,
        priority: 90,
        repositoryUrl: 'https://github.com/thatrooster/ecommerce-platform',
        demoUrl: 'https://demo-ecommerce.vercel.app',
        caseStudyUrl: 'https://thatrooster.dev/case-studies/ecommerce',
        featuredImage: '/images/projects/ecommerce-1.jpg',
        gallery: ['/images/projects/ecommerce-1.jpg', '/images/projects/ecommerce-2.jpg'],
        tags: ['ecommerce', 'payments', 'analytics', 'admin'],
        role: 'Lead Developer',
        client: 'TechStore Ltd',
        team: ['Lead Developer', '2 Frontend Developers'],
        metrics: {
          'conversion_rate': '3.2%',
          'load_time': '1.8s',
          'uptime': '99.9%'
        },
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-11-30')
      }
    });

    const project3 = await prisma.project.upsert({
      where: { slug: 'task-management-app' },
      update: {},
      create: {
        title: 'App Gestione Task',
        slug: 'task-management-app',
        description: 'Applicazione per la gestione dei task con funzionalità collaborative e timeline interattive.',
        longDescription: 'App di produttività progettata per team di lavoro. Include creazione e gestione task, assegnazione membri, timeline progetti, notifiche real-time e dashboard analytics per monitorare i progressi.',
        categoryId: webDev.id,
        status: 'IN_PROGRESS',
        featured: false,
        priority: 80,
        repositoryUrl: 'https://github.com/thatrooster/task-manager',
        featuredImage: '/images/projects/taskmanager-1.jpg',
        tags: ['productivity', 'collaboration', 'realtime'],
        role: 'Frontend Developer',
        client: 'StartupXYZ',
        team: ['Frontend Developer', '1 Designer'],
        startDate: new Date('2024-10-01')
      }
    });

    // 4. Associa tecnologie ai progetti
    await prisma.projectTechnology.createMany({
      data: [
        // Portfolio project
        { projectId: project1.id, technologyId: nextjs.id, importance: 5 },
        { projectId: project1.id, technologyId: react.id, importance: 5 },
        { projectId: project1.id, technologyId: typescript.id, importance: 4 },
        { projectId: project1.id, technologyId: tailwind.id, importance: 4 },
        
        // E-commerce project
        { projectId: project2.id, technologyId: nextjs.id, importance: 5 },
        { projectId: project2.id, technologyId: react.id, importance: 5 },
        { projectId: project2.id, technologyId: typescript.id, importance: 4 },
        
        // Task manager project
        { projectId: project3.id, technologyId: react.id, importance: 5 },
        { projectId: project3.id, technologyId: typescript.id, importance: 4 },
        { projectId: project3.id, technologyId: tailwind.id, importance: 3 }
      ],
      skipDuplicates: true
    });

    console.log('✅ Database popolato con successo!');
    console.log(`- Creati 3 progetti`);
    console.log(`- Categorie: ${webDev.name}, ${mobileApp.name}`);
    console.log(`- Tecnologie: React, Next.js, TypeScript, TailwindCSS`);

  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProjects();