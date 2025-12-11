'use client'

import { signIn } from 'next-auth/react'

interface LoginButtonProps {
  availableProviders?: {
    google: boolean
    github: boolean
  }
}

export default function LoginButton({ availableProviders }: LoginButtonProps) {
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
    }
  }

  const showGoogle = availableProviders?.google !== false
  const showGitHub = availableProviders?.github === true

  return (
    <div className="flex gap-4">
      {showGoogle && (
        <button
          onClick={() => handleSignIn('google')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      )}
      {showGitHub && (
        <button
          onClick={() => handleSignIn('github')}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          Sign in with GitHub
        </button>
      )}
    </div>
  )
}

