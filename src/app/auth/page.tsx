"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/lib/supabaseClient"

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl ring-1 ring-blue-200">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-wide text-blue-900">
          Altar Practice – Sign In
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#2563eb", // blue-600
                  brandAccent: "#1d4ed8", // blue-700
                  inputLabelText: "#1e3a8a", // blue-900
                  inputText: "#1e293b", // slate-800
                },
                radii: { inputBorderRadius: "0.5rem", buttonBorderRadius: "0.5rem" },
              },
            },
          }}
          providers={[]}
          redirectTo={typeof window !== "undefined" ? `${window.location.origin}/` : undefined}
        />
      </div>
    </main>
  )
}
