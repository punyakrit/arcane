# Arcane - The All-in-One Workspace


Arcane is a powerful, AI-driven workspace platform that brings together notes, tasks, documents, databases, and team collaboration in one beautifully designed interface. Built with modern web technologies and designed for teams of all sizes.


### 🚀 All-in-One Workspace
- Rich text editor with advanced formatting
- Whiteboard and visual collaboration
- Live editing with multiple users

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
