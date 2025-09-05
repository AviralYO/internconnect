import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CompanySetupForm } from "@/components/company/setup-form"

export default async function CompanySetupPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/company/login")
  }

  // Check if company profile already exists
  const { data: company } = await supabase.from("companies").select("*").eq("id", data.user.id).single()

  // If profile exists, redirect to dashboard
  if (company) {
    redirect("/company/dashboard")
  }

  return <CompanySetupForm user={data.user} />
}
