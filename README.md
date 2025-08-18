# Arcane - The All-in-One Workspace


Arcane is a powerful, AI-driven workspace platform that brings together notes, tasks, documents, databases, and team collaboration in one beautifully designed interface. Built with modern web technologies and designed for teams of all sizes.

## ✨ Features

### 🤖 AI-Powered Content
- Smart content suggestions and auto-completion
- AI-assisted writing and content generation
- Intelligent document summarization
- Automated workflow suggestions

### 👥 Real-time Collaboration
- Live editing with multiple users
- Instant comments and discussions
- Real-time cursor tracking
- Seamless file sharing

### 🚀 All-in-One Workspace
- Rich text editor with advanced formatting
- Kanban boards and project management
- Database and spreadsheet functionality
- Calendar and scheduling integration
- Whiteboard and visual collaboration

### 🔗 Advanced Integrations
- Connect with 100+ popular tools
- Slack, Discord, and Teams integration
- GitHub and GitLab sync
- Google Drive and Dropbox support
- Custom API integrations

### 🔍 Powerful Search
- Full-text search across all content
- Advanced filtering and sorting
- Tag-based organization
- Smart content discovery

### 🔒 Enterprise Security
- Bank-level encryption (AES-256)
- Single Sign-On (SSO) support
- SAML authentication
- SOC 2 and GDPR compliance
- Advanced audit logs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database (for production)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/punyakrit/arcane
cd arcane
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
```

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see Arcane in action.

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible component library
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Supabase** - Backend as a service with real-time capabilities
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication solution

### Real-time Features
- **Socket.io** - Real-time bidirectional communication
- **Supabase Realtime** - Live database updates



## 🏗️ Project Structure

```
arcane/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (main)/         # Main application pages
│   │   └── (site)/         # Landing page
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── landingPage/    # Landing page components
│   │   ├── sidebar/        # Navigation components
│   │   └── ui/            # Base UI components
│   ├── lib/               # Utility functions and configurations
│   │   ├── provider/      # Context providers
│   │   ├── server-actions/ # Server-side actions
│   │   ├── store/         # State management
│   │   └── supabase/      # Database queries and config
│   └── pages/api/         # API routes
├── prisma/                # Database schema and migrations
├── public/               # Static assets
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push


### Manual Deployment
```bash
npm run build
npm start
```



Built with ❤️ by the Arcane team
