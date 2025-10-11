# 📁 Project Structure

This document outlines the organized structure of the portfolio project.

## 🏗️ Directory Structure

```
my-portfolio/
├── 📄 Configuration Files
│   ├── next.config.js          # Next.js configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── eslint.config.mjs       # ESLint configuration
│   ├── postcss.config.mjs      # PostCSS configuration
│   └── package.json            # Dependencies and scripts
│
├── 🔐 Environment & Security
│   ├── .env                    # Environment variables (private)
│   ├── .env.example           # Environment template
│   └── middleware.ts          # Next.js middleware
│
├── 🗄️ Database
│   ├── prisma/                # Database schema and migrations
│   └── seed-projects.mjs      # Database seeding script
│
├── 🎨 Frontend (src/)
│   ├── app/                   # Next.js App Router pages and API
│   │   ├── api/              # API endpoints
│   │   ├── admin/            # Admin panel pages
│   │   ├── auth/             # Authentication pages
│   │   └── projects/         # Portfolio pages
│   │
│   ├── components/           # React components (organized by feature)
│   │   ├── portfolio/        # Portfolio-related components
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectFilters.tsx
│   │   │   └── ProjectGrid.tsx
│   │   ├── layout/           # Layout and general UI components
│   │   │   └── CoinFlip.tsx
│   │   ├── admin/            # Admin-specific components
│   │   └── ui/               # Reusable UI components
│   │       └── FileUpload.tsx
│   │
│   ├── lib/                  # Utilities and configurations
│   │   ├── database/         # Database utilities
│   │   │   └── prisma.ts
│   │   ├── security/         # Security modules
│   │   │   ├── 2fa.ts
│   │   │   ├── config.ts
│   │   │   ├── encryption.ts
│   │   │   ├── jwt.ts
│   │   │   └── middleware.ts
│   │   ├── utils/            # General utilities
│   │   ├── auth.ts           # Authentication logic
│   │   ├── auth-client.ts    # Client-side auth utilities
│   │   └── index.ts          # Centralized exports
│   │
│   └── types/                # TypeScript type definitions
│       └── project.ts
│
└── 🌐 Public Assets
    ├── icons/                # SVG icons and logos
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── ...
    └── images/               # Images and media
        ├── avatar.jpg
        ├── gallo.png
        └── projects/         # Project images (uploads)
```

## 🎯 Organization Principles

### **Components Structure**
- `portfolio/` - Components specific to portfolio display
- `admin/` - Components for admin functionality
- `layout/` - General layout and UI components
- `ui/` - Reusable, generic UI components

### **Lib Structure**
- `database/` - Database connection and utilities
- `security/` - Security-related modules (2FA, JWT, encryption)
- `utils/` - General utility functions
- `index.ts` - Centralized exports for easy imports

### **Public Assets**
- `icons/` - SVG icons and vector graphics
- `images/` - Raster images and media files
- `images/projects/` - Uploaded project images

## 🚀 Key Features

### **Authentication System**
- 2FA with TOTP support
- JWT tokens with secure encryption
- Admin role-based access control
- Session management with cookies

### **File Upload System**
- Secure file upload with validation
- Magic byte verification for file types
- Admin-only access
- Automatic file naming and organization

### **Database Integration**
- PostgreSQL with Prisma ORM
- Type-safe database queries
- Project status management
- User authentication storage

## 📝 Development Guidelines

1. **Import Organization**: Use centralized exports from `lib/index.ts`
2. **Component Placement**: Place components in appropriate feature directories
3. **Type Safety**: All database operations are type-safe with Prisma
4. **Security First**: All admin operations require authentication
5. **File Organization**: Keep related files together in logical directories

## 🛠️ Maintenance

- Configuration files are centralized in root
- Database schema managed through Prisma migrations
- Security configurations isolated in `lib/security/`
- Public assets organized by type and function