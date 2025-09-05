import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentSetupForm } from "@/components/student/setup-form"

export default async function StudentSetupPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/student/login")
  }

  // Check if student profile already exists
  const { data: student } = await supabase.from("students").select("*").eq("id", data.user.id).single()

  // If profile exists, redirect to dashboard
  if (student) {
    redirect("/student/dashboard")
  }

  return <StudentSetupForm user={data.user} />
}
