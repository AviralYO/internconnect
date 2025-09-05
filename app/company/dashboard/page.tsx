import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CompanyDashboardContent } from "@/components/company/dashboard-content"

export default async function CompanyDashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/company/login")
  }

  // Parallel database queries for better performance
  const [
    { data: company },
    { data: internships },
  ] = await Promise.all([
    supabase.from("companies").select("*").eq("id", data.user.id).single(),
    supabase
      .from("internships")
      .select("id, title, is_active")
      .eq("company_id", data.user.id)
  ])

  // If no company profile, redirect to setup
  if (!company) {
    redirect("/company/setup")
  }

  // Get applications in parallel after we have internships
  const { data: applications } = await supabase
    .from("applications")
    .select("id, status, internship_id")
    .in("internship_id", internships?.map((i) => i.id) || [])

  const stats = {
    totalInternships: internships?.length || 0,
    activeInternships: internships?.filter((i) => i.is_active).length || 0,
    totalApplications: applications?.length || 0,
    pendingApplications: applications?.filter((a) => a.status === "pending").length || 0,
  }

  return <CompanyDashboardContent company={company} stats={stats} />
}
