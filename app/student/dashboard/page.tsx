import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboardContent } from "@/components/student/dashboard-content"

export default async function StudentDashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/student/login")
  }

  // Parallel database queries for better performance
  const [
    { data: student },
    { data: applications },
    { data: resumes }
  ] = await Promise.all([
    supabase.from("students").select("*").eq("id", data.user.id).single(),
    supabase
      .from("applications")
      .select(`
        id, status, applied_at,
        internship:internships(
          title,
          company:companies(company_name)
        )
      `)
      .eq("student_id", data.user.id),
    supabase.from("resumes").select("id").eq("student_id", data.user.id)
  ])

  // If no student profile, redirect to setup
  if (!student) {
    redirect("/student/setup")
  }

  const stats = {
    totalApplications: applications?.length || 0,
    pendingApplications: applications?.filter((a) => a.status === "pending").length || 0,
    acceptedApplications: applications?.filter((a) => a.status === "accepted").length || 0,
    confirmedApplications: applications?.filter((a) => a.status === "confirmed").length || 0,
    rejectedApplications: applications?.filter((a) => a.status === "rejected").length || 0,
    totalResumes: resumes?.length || 0,
  }

  return <StudentDashboardContent student={student} stats={stats} applications={applications as any || []} />
}
