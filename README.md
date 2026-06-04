## Hi there 👋

<!--
**risewithdata/risewithdata** is a ✨ _special_ ✨ repository because its `# RiseWithData

Enterprise-grade SaaS platform for online education. Built with Next.js 16, TypeScript, React Server Components, Prisma, and PostgreSQL.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up .env.local (see SETUP.md for details)
DATABASE_URL=postgresql://localhost:5432/risewithdata_dev
APP_URL=http://localhost:3000

# 3. Set up database
npx prisma generate
npx prisma migrate dev --name init

# 4. Start dev server
npm run dev
```

Open http://localhost:3000

## Architecture

- **Server Components by default** for SEO and performance.
- **Server Actions** for all mutations (secure, type-safe).
- **Feature-based organization** with clear separation of concerns.
- **Prisma ORM** for database access (isolated to repositories).
- **Zod** for validation (client & server).
- **React Hook Form** + **shadcn/ui** for forms and UI.

### Key Directories

- `app/` — Next.js App Router routes (marketing + platform)
- `features/` — Feature modules (courses, teams, resources, etc.)
- `shared/` — Shared UI components, forms, tokens
- `infrastructure/` — Third-party integrations (email, analytics)
- `lib/` — Framework helpers and utilities
- `prisma/` — Database schema and migrations

### Data Flow

```
UI (Server Component) 
  → Service (business rules) 
  → Repository (Prisma) 
  → Database
```

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run prisma:migrate   # Create migrations
npm run prisma:seed      # Seed dev data
```

## Documentation

- **Setup Guide**: See `SETUP.md` for detailed setup, architecture, and examples.
- **Architecture Document**: See the Architecture Decision Document for full design patterns.

## Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS
- **Forms**: React Hook Form, Zod
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Backend**: Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Email**: Resend
- **Deployment**: Railway

## License

Proprietary
` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
