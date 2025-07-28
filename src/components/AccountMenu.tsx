"use client"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AccountMenu() {
  const router = useRouter()
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
    >
      Sign out
    </button>
  )
}
