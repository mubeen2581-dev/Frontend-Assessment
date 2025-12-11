import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import LogoutButton from '@/components/LogoutButton'
import ArchitectureDiagram from '@/components/ArchitectureDiagram'
import { ArchitectureData } from '../api/architecture/route'

async function getArchitectureData(): Promise<ArchitectureData> {
  try {
    // In server components, we can use relative URLs for internal API routes
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/architecture`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error('Failed to fetch architecture data')
    }
    return res.json()
  } catch (error) {
    // Fallback to default data if fetch fails
    return {
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
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const architectureData = await getArchitectureData()

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            User Profile
          </h2>
          <div className="space-y-3">
            {session.user?.image && (
              <div className="flex items-center gap-4">
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {session.user?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            )}
            {!session.user?.image && (
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Diagram Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Architecture Diagram
          </h2>
          <ArchitectureDiagram data={architectureData} />
        </div>
      </div>
    </main>
  )
}

