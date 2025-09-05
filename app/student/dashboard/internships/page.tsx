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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Browse Internships
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Discover amazing internship opportunities from top companies
              </p>
            </div>
            <a 
              href="/student/dashboard" 
              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              ← Back to Dashboard
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search & Filter Card */}
            <div className="rounded-lg p-6 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Smart Search
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                AI-powered search with filters for location, role, and skills
              </p>
            </div>

            {/* Saved Internships Card */}
            <div className="rounded-lg p-6 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xl">💾</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Saved Opportunities
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Keep track of internships you're interested in
              </p>
            </div>

            {/* Application Tracker Card */}
            <div className="rounded-lg p-6 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Application Tracker
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Monitor your application status in real-time
              </p>
            </div>

            {/* Company Insights Card */}
            <div className="rounded-lg p-6 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Company Insights
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Get detailed information about companies and their culture
              </p>
            </div>

            {/* Skills Matching Card */}
            <div className="rounded-lg p-6 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Skills Matching
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Find internships that match your skills and experience
              </p>
            </div>

            {/* Interview Prep Card */}
            <div className="rounded-lg p-6 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <span className="text-xl">🎤</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Interview Prep
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Practice interviews and get tips for success
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="rounded-lg p-8" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Coming Soon!
              </h2>
              <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                We're building an amazing internship discovery platform with AI-powered matching, 
                real-time notifications, and comprehensive company insights. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
