import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function StudentInternshipsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/student/login")
  }

  // Check if student profile exists
  const { data: student } = await supabase.from("students").select("*").eq("id", data.user.id).single()

  if (!student) {
    redirect("/student/setup")
  }

  return (
    <div className="min-h-screen" style={{
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Browse Internships
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Discover amazing internship opportunities from top companies
            </p>
          </div>
          
          <div className="rounded-lg p-8 text-center" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
          }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Coming Soon!
            </h2>
            <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
              The internship browsing feature is currently under development. 
              You'll be able to search and apply for internships here soon.
            </p>
            <a 
              href="/student/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
