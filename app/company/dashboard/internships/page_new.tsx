import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function CompanyInternshipsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/company/login")
  }

  // Check if company profile exists
  const { data: company } = await supabase.from("companies").select("*").eq("id", data.user.id).single()

  if (!company) {
    redirect("/company/setup")
  }

  return (
    <div className="min-h-screen" style={{
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Manage Internships
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Create and manage your internship postings
              </p>
            </div>
            <a 
              href="/company/dashboard" 
              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              ← Back to Dashboard
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Post New Internship Card */}
            <a href="/company/internships/new" className="block">
              <div className="rounded-lg p-8 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl">➕</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Post New Internship
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Create a new internship opportunity for students to discover and apply to
                </p>
              </div>
            </a>

            {/* Manage Existing Internships Card */}
            <div className="rounded-lg p-8 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Manage Postings
              </h2>
              <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Edit, update, or remove your existing internship postings.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1">
                🔧 Coming Soon
              </div>
            </div>

            {/* Analytics Card */}
            <div className="rounded-lg p-8 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Analytics & Reports
              </h2>
              <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                View detailed analytics on your internship postings and applications.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1">
                📈 Coming Soon
              </div>
            </div>

            {/* Application Management Card */}
            <div className="rounded-lg p-8 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Review Applications
              </h2>
              <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Review and manage applications from interested students.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1">
                👔 Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
