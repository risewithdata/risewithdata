# RiseWithData - Architecture & Setup Guide

## Project Overview

Enterprise-grade SaaS platform for online education (similar to Product School). Built with Next.js 16, TypeScript, Prisma, and PostgreSQL. Fully server-component-first architecture with Server Actions for mutations.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/risewithdata_dev
DIRECT_URL=postgresql://user:password@localhost:5432/risewithdata_dev
APP_URL=http://localhost:3000
NODE_ENV=development
```

**For Railway Staging/Production**, set these in the Railway dashboard instead.

### 3. Run Prisma Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates the database schema locally.

### 4. Seed Development Data (Optional)

```bash
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
/
├─ app/                          # Next.js App Router
│  ├─ (marketing)/               # Public marketing site
│  │  ├─ courses/                # Course catalog
│  │  └─ blog/                   # Blog listing
│  └─ (platform)/                # Internal platform (auth later)
│     └─ admin/courses/create/   # Admin course creation
├─ features/                      # Feature modules (self-contained)
│  └─ courses/                    # Courses feature
│     ├─ components/              # React components (server & client)
│     ├─ actions/                 # Server Actions
│     ├─ schemas/                 # Zod validation schemas
│     ├─ services/                # Business logic & orchestration
│     ├─ repositories/            # Prisma database access
│     ├─ queries/                 # Server-side fetch helpers
│     ├─ types/                   # Domain types (DTOs)
│     ├─ hooks/                   # Custom React hooks
│     ├─ constants/               # Feature constants
│     └─ tests/                   # Feature tests
├─ shared/                        # Shared across all features
│  ├─ ui/                         # shadcn/ui components
│  ├─ forms/                      # Form wrappers (RHF + Zod)
│  ├─ domain/                     # Shared types & constants
│  ├─ hooks/                      # Shared hooks
│  └─ services/                   # Shared service adapters
├─ infrastructure/                # Third-party integrations
│  ├─ adapters/                   # Email, analytics, payments
│  └─ integrations/               # External service clients
├─ lib/                           # Framework helpers
│  ├─ seo/                        # SEO metadata generation
│  ├─ server-action-helpers/      # Server Action utilities
│  └─ validators/                 # Validation helpers
├─ prisma/                        # Database schema & migrations
│  ├─ schema.prisma               # Prisma data model
│  ├─ migrations/                 # Migrations (git-tracked)
│  └─ seed/                       # Seed scripts
└─ configs/                       # Configuration files
   ├─ next.config.ts
   ├─ tsconfig.json
   ├─ tailwind.config.ts
   └─ .eslintrc.js
```

---

## Architecture Highlights

### 1. Server Components by Default
- Pages and most components are Server Components (SSR + SEO).
- Use `"use client"` only for interactivity (forms, state).

### 2. Data Flow
```
UI (Server Component)
  ↓ (async, server-side)
Service (business rules)
  ↓
Repository (Prisma + DB)
  ↓
PostgreSQL Database
```

### 3. Server Actions for Mutations
```
Client Form (RHF + Zod validation)
  ↓ (submit)
Server Action (createCourseAction)
  ↓ (validate again with Zod)
Service
  ↓
Repository + Prisma
  ↓
Database (commit)
  ↓
Return typed Result<T> to client
```

### 4. Prisma Rules
- **Never call Prisma directly from UI components.**
- All Prisma calls isolated in `repositories/`.
- Services call repositories and handle business logic.

---

## Example: Creating a Course

### 1. Define Schema (Validation)

`features/courses/schemas/course.schema.ts`:
```typescript
export const CourseCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().optional()
});
```

### 2. Repository Layer (Database)

`features/courses/repositories/course.repository.ts`:
```typescript
export const courseRepository = {
  async create(input: CourseCreateInput): Promise<CourseDTO> {
    const course = await prisma.course.create({ data: input });
    return mapToDomain(course);
  }
};
```

### 3. Service Layer (Business Rules)

`features/courses/services/course.service.ts`:
```typescript
export const courseService = {
  async createCourse(input: CourseCreateInput) {
    const created = await courseRepository.create(input);
    // TODO: trigger email, events, etc.
    return created;
  }
};
```

### 4. Server Action (Mutation Handler)

`features/courses/actions/createCourse.server.ts`:
```typescript
export async function createCourseAction(payload: unknown) {
  const parsed = CourseCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: { ... } };
  }
  const course = await courseService.createCourse(parsed.data);
  return { success: true, data: course };
}
```

### 5. Client Form

`features/courses/components/CreateCourseForm.client.tsx`:
```typescript
"use client";
export function CreateCourseForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(CourseCreateSchema)
  });
  
  const onSubmit = async (data) => {
    const result = await createCourseAction(data);
    // Handle result...
  };
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

---

## Key Npm Commands

```bash
# Development
npm run dev                  # Start dev server
npm run lint                 # Run ESLint

# Database
npm run prisma:generate      # Regenerate Prisma client
npm run prisma:migrate       # Create migrations interactively
npm run prisma:deploy        # Apply pending migrations (CI/prod)
npm run prisma:seed          # Run seed script

# Build & Production
npm run build                # Build for production
npm start                    # Start production server
```

---

## Environment Variables

### Development (`.env.local`)
```
DATABASE_URL=postgresql://localhost:5432/risewithdata_dev
DIRECT_URL=postgresql://localhost:5432/risewithdata_dev
APP_URL=http://localhost:3000
NODE_ENV=development
```

### Staging/Production (Railway Dashboard)
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
APP_URL=https://staging.app.risewithdata.com  (or production URL)
NODE_ENV=production
```

---

## Deployment (Railway)

1. **Create Railway project** and link GitHub repo.
2. **Add PostgreSQL plugin** to project.
3. **Set environment variables** in Railway dashboard.
4. **Push to main branch** → Railway auto-deploys.
5. **Migrations run** via CI step before deployment.

---

## Engineering Standards

### Naming Conventions
- **Files**: `kebab-case.tsx` for components, `camelCase.server.ts` for server actions.
- **Types**: `CourseDTO`, `CourseCreateInput`.
- **Schemas**: `CourseCreateSchema`.
- **Repositories**: `*.repository.ts`.
- **Services**: `*.service.ts`.

### Import Paths
Use TypeScript path aliases:
```typescript
import Button from '@shared/ui/shadcn/button';
import { courseService } from '@features/courses/services/course.service';
import { prisma } from '@lib/prisma.config';  // lib aliases work too
```

### Server Actions
- Always return a typed `Result<T>` union.
- Validate input twice: client-side (UX), server-side (security).
- Keep them light; delegate to services.

---

## Next Steps

1. **Wire PostgreSQL locally** or use Railway for shared dev DB.
2. **Extend Prisma models** for other features (Teams, Resources, etc.).
3. **Create feature teams** and assign ownership per folder.
4. **Set up CI/CD** with GitHub Actions for linting, testing, migration checks.
5. **Build auth module** (separate from this architecture).

---

## Key Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

Maintained by: Platform Architecture Team
