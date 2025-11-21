# ITPE Assistant

> AI-powered study assistant for the IT Professional Examination (정보관리기술사)

A modern web application built with Next.js 16, featuring a distinctive "Study Atelier" design aesthetic that combines academic elegance with warm, inviting colors.

## Features

- **Sub-notes Management**: Create, edit, and organize your study materials with full CRUD functionality
- **Dashboard**: Track your study progress, recent activities, and statistics
- **AI Suggestions**: Get personalized topic recommendations based on exam trends
- **Exam Topics**: Browse and study official exam questions
- **Community**: Share and learn from other students' sub-notes
- **AI Evaluations**: Request detailed feedback on your answers using Claude and GPT models
- **Study Sessions**: Track your study time and activities

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Styling**: Tailwind CSS 4 + Radix UI components
- **AI Integration**: AI SDK with Anthropic Claude and OpenAI support
- **Typography**: Crimson Pro (serif) for headings, Geist Sans for body text
- **Code Quality**: Biome for linting and formatting

## Design Philosophy

The app features a **"Study Atelier"** aesthetic:
- Warm cream backgrounds (#fcfaf7) inspired by quality paper
- Forest green accents (#3d5a4c) for a calm, focused atmosphere
- Bronze/gold highlights (#c49a6c) for subtle luxury
- Serif typography (Crimson Pro) for academic elegance
- Subtle paper textures and corner brackets for technical drawing aesthetics

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- A Neon database account
- API keys for Anthropic and/or OpenAI (optional, for AI features)

### Installation

1. Clone the repository:
```bash
cd itpe-assistant
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
```

4. Generate and push database schema:
```bash
pnpm db:push
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Commands

```bash
# Generate migration files
pnpm db:generate

# Push schema to database (without migrations)
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Project Structure

```
itpe-assistant/
├── app/                      # Next.js App Router
│   ├── sub-notes/           # Sub-notes CRUD pages
│   │   ├── [id]/           # Individual sub-note view
│   │   ├── new/            # Create new sub-note
│   │   ├── actions.ts      # Server actions
│   │   └── page.tsx        # Sub-notes list
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard
│   └── globals.css         # Global styles + theme
│
├── components/
│   ├── navigation/         # Sidebar and navigation
│   ├── ui/                 # Reusable UI components (shadcn)
│   └── ai-elements/        # AI-specific components
│
├── src/
│   └── db/                 # Database configuration
│       ├── schema.ts       # Database schema
│       └── index.ts        # Database client
│
├── lib/                    # Utility functions
├── drizzle.config.ts       # Drizzle configuration
└── package.json
```

## Database Schema

The app uses the following main tables:

- **sub_notes**: User's personal study notes
- **exam_topics**: Official exam questions and topics
- **shared_sub_notes**: Community-shared study materials
- **ai_topic_suggestions**: AI-generated topic recommendations
- **ai_evaluations**: AI feedback and scores on answers
- **study_sessions**: Study time tracking

See `src/db/schema.ts` for the complete schema definition.

## Features Implementation Status

### ✅ Completed
- Database schema and connection setup
- Main layout with sidebar navigation
- Dashboard with stats and quick actions
- Sub-notes listing with filters
- Sub-note detail view
- Sub-note creation form
- Server actions for CRUD operations
- Study Atelier design theme
- Responsive layout

### 🚧 In Progress / Planned
- Authentication integration
- Real-time AI evaluations
- Exam topics database
- Community sharing features
- Study session tracking
- Advanced search and filtering
- Markdown preview for sub-notes
- Export functionality

## Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --background: #fcfaf7;  /* Warm cream */
  --primary: #3d5a4c;     /* Forest green */
  --accent: #c49a6c;      /* Bronze/gold */
  /* ... */
}
```

### Typography

The app uses:
- **Crimson Pro** (serif) for headings - academic elegance
- **Geist Sans** for body text - modern readability
- **Geist Mono** for code blocks

To change fonts, edit the Google Fonts import in `globals.css` and update the font families.

## Contributing

This is a personal study project, but suggestions and improvements are welcome!

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database hosted on [Neon](https://neon.tech/)
- AI powered by [Anthropic Claude](https://anthropic.com/) and [OpenAI](https://openai.com/)
