# Architecture Dashboard

A Next.js mini dashboard application with OAuth authentication and an interactive D3.js architecture diagram.

## Features

- **OAuth 2.0 Authentication**: Sign in with Google or GitHub using NextAuth.js
- **Protected Routes**: Middleware-based route protection
- **User Profile**: Display authenticated user information
- **Interactive D3.js Diagram**: 
  - Force-directed graph visualization
  - Draggable nodes
  - Color-coded node types
  - Hover effects and labels
  - Smooth animations

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **NextAuth.js** (OAuth authentication)
- **D3.js** (Data visualization)
- **Tailwind CSS** (Styling)

## Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Frontend Assessment (Copy)"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your OAuth credentials in `.env.local`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # GitHub OAuth (optional)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Generate NextAuth secret**
   
   You can generate a secret using:
   ```bash
   openssl rand -base64 32
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local`

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/     # NextAuth configuration
│   │   └── architecture/          # Architecture data API
│   ├── dashboard/                 # Protected dashboard page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/login page
│   └── providers.tsx              # Session provider
├── components/
│   ├── ArchitectureDiagram.tsx    # D3.js diagram component
│   ├── LoginButton.tsx            # OAuth login buttons
│   └── LogoutButton.tsx           # Logout button
├── middleware.ts                  # Route protection middleware
└── package.json
```

## API Endpoints

### GET `/api/architecture`

Returns the architecture diagram data in JSON format:

```json
{
  "nodes": [
    { "id": "client", "name": "Next.js Client", "type": "frontend" },
    { "id": "auth", "name": "OAuth Provider", "type": "auth" },
    { "id": "api", "name": "Backend API", "type": "backend" },
    { "id": "db", "name": "Database", "type": "database" }
  ],
  "links": [
    { "source": "client", "target": "auth" },
    { "source": "client", "target": "api" },
    { "source": "api", "target": "db" }
  ]
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Diagram Features

- **Force Simulation**: Nodes are positioned using D3's force simulation
- **Draggable Nodes**: Click and drag nodes to reposition them
- **Color Coding**: 
  - Frontend: Blue
  - Auth: Green
  - Backend: Orange
  - Database: Red
- **Hover Effects**: Nodes expand and labels highlight on hover
- **Smooth Animations**: Physics-based animations for natural movement

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Make sure to update `NEXTAUTH_URL` in your environment variables to your production URL.

## License

ISC

