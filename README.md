# Sohail Gidwani - Portfolio

A modern, performant portfolio website built with Next.js 15, featuring smooth animations, dark/light theme support, and a blog system powered by PostgreSQL.

**Live:** [sohailgidwani.app](https://sohailgidwani.app)

## Features

- **Modern UI/UX** - Clean design with Framer Motion animations, hover interactions, and shooting star background effects
- **Dark/Light Mode** - System-aware theme switching with smooth transitions
- **Blog System** - Full CRUD blog with PostgreSQL backend and Markdown support
- **SEO Optimized** - Schema.org structured data, dynamic OG images, sitemap generation
- **Responsive** - Mobile-first design with adaptive layouts
- **Guided Tour** - Interactive onboarding for first-time visitors
- **Performance** - Optimized images, code splitting, and minimal bundle size

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Database** | PostgreSQL (Neon) |
| **UI Components** | Radix UI, Lucide Icons |
| **Deployment** | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) for serverless)

### Installation

```bash
# Clone the repository
git clone https://github.com/SohailGidwani/next-portfolio.git
cd next-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

## Project Structure

```
app/
├── api/                # API routes (blogs, images, OG generation)
├── blogs/              # Blog pages with dynamic routing
├── components/         # React components
│   ├── ui/             # Reusable UI primitives
│   ├── Hero.tsx        # Landing section with shooting stars
│   ├── Projects.tsx    # Featured projects grid
│   ├── Skills.tsx      # Technical skills showcase
│   └── ...
├── projects/           # Individual project pages
├── layout.tsx          # Root layout with metadata
└── page.tsx            # Home page
lib/
├── db.ts               # PostgreSQL connection
└── utils.ts            # Utility functions
public/
├── images/             # Project screenshots
└── skill-icons/        # Technology icons
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT

---

Built by [Sohail Gidwani](https://github.com/SohailGidwani)
