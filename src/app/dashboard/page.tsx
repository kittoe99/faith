"use client"

import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) {
    return (
      <main className="p-6">
        <div className="text-blue-600">Loading...</div>
      </main>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>
        <p className="mt-4 text-gray-600">
          Welcome back, {user?.email}!
        </p>
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800">Authentication Working!</h2>
          <p className="text-green-700 mt-2">
            You are successfully authenticated and can access protected pages.
          </p>
        </div>
      </main>
    </AuthGuard>
  )
}
