import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ResumeManagement } from "@/components/student/resume-management"

export default async function StudentDashboardResumesPage() {
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

  // Get student's resumes
  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("student_id", data.user.id)
    .order("uploaded_at", { ascending: false })

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
                Resume Management
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Upload and manage your resumes and portfolios
              </p>
            </div>
            <a 
              href="/student/dashboard" 
              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              ← Back to Dashboard
            </a>
          </div>
          
          <ResumeManagement studentId={data.user.id} initialResumes={resumes || []} />
        </div>
      </div>
    </div>
  )
}
