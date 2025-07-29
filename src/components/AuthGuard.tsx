"use client"

import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !session) {
        router.push('/auth')
      } else if (!requireAuth && session) {
        router.push('/')
      }
    }
  }, [session, loading, requireAuth, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null // Will redirect via useEffect
  }

  if (!requireAuth && session) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}
