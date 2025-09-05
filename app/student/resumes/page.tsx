import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ResumeManagement } from "@/components/student/resume-management"

export default async function StudentResumesPage() {
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

  return <ResumeManagement studentId={data.user.id} initialResumes={resumes || []} />
}
