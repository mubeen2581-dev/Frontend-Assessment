import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import LoginButton from '@/components/LoginButton'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  // Check which providers are configured
  const availableProviders = {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Architecture Dashboard
        </h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
          Please sign in to access the dashboard
        </p>
        <div className="flex justify-center">
          <LoginButton availableProviders={availableProviders} />
        </div>
      </div>
    </main>
  )
}

