import { NextResponse } from 'next/server'

export interface ArchitectureNode {
  id: string
  name: string
  type: 'frontend' | 'auth' | 'backend' | 'database'
}

export interface ArchitectureLink {
  source: string
  target: string
}

export interface ArchitectureData {
  nodes: ArchitectureNode[]
  links: ArchitectureLink[]
}

export async function GET() {
  const architectureData: ArchitectureData = {
    nodes: [
      { id: 'client', name: 'Next.js Client', type: 'frontend' },
      { id: 'auth', name: 'OAuth Provider', type: 'auth' },
      { id: 'api', name: 'Backend API', type: 'backend' },
      { id: 'db', name: 'Database', type: 'database' },
    ],
    links: [
      { source: 'client', target: 'auth' },
      { source: 'client', target: 'api' },
      { source: 'api', target: 'db' },
    ],
  }

  return NextResponse.json(architectureData)
}

