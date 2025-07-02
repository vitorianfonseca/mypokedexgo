"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import GoogleLoginSection from "@/components/GoogleLoginSection"
import { Logo } from "@/components/Logo"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <Logo />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to MyPokéDex GO
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your personal Pokédex inspired by Pokémon GO
            </p>
          </div>
        </div>

        {/* Google Login Section */}
        <GoogleLoginSection />

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Sign in to save your progress and sync across devices
          </p>
        </div>
      </div>
    </div>
  )
}
